
import admin from 'firebase-admin';
import { User, AuthService, userRepository } from '@app/auth';
import { logger, transporter } from '@app/core';
import { uniq } from 'lodash';
import { config } from '@app/config';
import appleSignIn from 'apple-signin';

const authService: AuthService = {
  setup: (app, path) => {
    app.post(path + '/send-reset-password-code/', async (req: any, res: any) => {
      try {
        const { email } = req.body;
        const existedEmail = await userRepository.findOne({email});
        if (existedEmail) {
          sendResetCode(existedEmail);
          res.status(200).json({
            code: 1,
            message: 'resetPasscodeSent',
          });
        } else {
          res.status(200).json({
            code: 0,
            message: 'cannotFindUserWithThisEmail',
          });
        }
      } catch (error) {
        logger.error(error);
        res.status(error.status || 500).end(error.message || req.t('internalServerError'));
      }
    });
    app.post(path + '/reset-password', async (req: any, res: any) => {
      try {
        const { code, email, password } = req.body;
        const existedUser = await userRepository.findOne({
          email,
          'resetPasscode.code': code,
          'resetPasscode.createdAt': {
            $gte: Date.now() - config.resetPasswordCodeTime,
          },
        }) as any;
        if (existedUser) {
          await admin.auth().updateUser(existedUser._id, {
            password,
            emailVerified: true,
          });
          await userRepository.update({
            id: existedUser._id,
            resetPasscode: {},
          });
          res.status(200).json({
            code: 1,
            message: 'updatePasswordSuccess',
          });
        } else {
          res.status(200).json({
            code: 0,
            message: 'updatePasswordFailed',
          });
        }
      } catch (error) {
        logger.error(error);
        res.status(error.status || 500).end(error.message || req.t('internalServerError'));
      }
    });
    app.post(path + '/check-password-code', async (req: any, res: any) => {
      try {
        const { code, email } = req.body;
        const existedUser = await userRepository.findOne({
          email,
          'resetPasscode.code': code,
          'resetPasscode.createdAt': {
            $gte: Date.now() - config.resetPasswordCodeTime,
          },
        }) as any;
        if (existedUser) {
          res.status(200).json({
            code: 1,
            message: 'Code is ok',
          });
        } else {
          res.status(200).json({
            code: 0,
            message: 'passcodeNotFoundOrExpired',
          });
        }
      } catch (error) {
        logger.error(error);
        res.status(error.status || 500).end(error.message || req.t('internalServerError'));
      }
    });
    app.post(path + '/log-out', async (req: any, res: any) => {
      try {
        const { id, deviceToken } = req.body;
        if (id && deviceToken) {
          await userRepository.removeDeviceToken(id, deviceToken);
        }
        res.status(200).json({
          code: 1,
          message: 'OK',
        });
      } catch (error) {
        logger.error(error);
        res.status(error.status || 500).end(error.message || req.t('internalServerError'));
      }
    });
    app.get(path + '/apple-redirect', async (req: any, res: any) => {
      try {
        const options = config.apple;
        const tokenResponse = await appleSignIn.getAuthorizationToken(req.query.code, options);
        if (tokenResponse && tokenResponse.id_token) {
          const userIdResponse = await appleSignIn.verifyIdToken(tokenResponse.id_token, config.apple.clientID);
          if (userIdResponse && userIdResponse.sub) {
            const existedUser = await userRepository.findById(userIdResponse.sub) as any;
            if (existedUser) {
              const customToken = await admin.auth().createCustomToken(userIdResponse.sub);
              res.redirect(`${config.url.client}?token=${customToken}`);
            } else {
              res.redirect(`${config.url.client}?error_code=2`);
            }
          } else {
            res.redirect(`${config.url.client}?error_code=1`);
          }
        } else {
          res.redirect(`${config.url.client}?error_code=1`);
        }
      } catch (error) {
        logger.error(error);
        res.redirect(`${config.url.client}?error_code=1`);
      }
    });
  },
  create: async (data, params) => {
    // 1. verify id token
    // map & transform data
    const role = data.role ? await params.roleRepository.findRoleByName(data.role) : await params.roleRepository.findDefaultRoles();

    if (data.idToken) {
      const verifyIdToken: any = await admin.auth().verifyIdToken(data.idToken);
      const userFirebaseInfo = await admin.auth().getUser(verifyIdToken.uid);
      data.name = data.name ? data.name : (userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].displayName : '');
      const firstName = data.name ? data.name.split(' ')[0] : '';
      const lastName = data.name ? data.name.split(' ').slice(1, data.name.split(' ').length).join(' ') : '';

      // 2. add custom claims to firebase idToken
      if (!userFirebaseInfo.customClaims) {
        await admin.auth().setCustomUserClaims(verifyIdToken.uid, {
          roles: role ? role.map((v: any) => ({
            name: v.name,
            _id: v._id,
          })) : undefined,
          avatarUrl: '',
          name: data.name,
        });
        await admin.auth().updateUser(verifyIdToken.uid, {
          isOldUser: true,
        } as any);
      }

      // 3. create new mongo user
      const existedUser = await params.repository.findById(verifyIdToken.uid) as any;
      if (!existedUser) {
        const loginDetail = userFirebaseInfo.providerData[0].providerId === 'facebook.com'
        ? {
          uid: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].uid : '',
          email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
          provider: 'facebook',
        } : userFirebaseInfo.providerData[0].providerId === 'google.com' ? {
          uid: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].uid : '',
          email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
          provider: 'google',
        } : userFirebaseInfo.providerData[0].providerId === 'password' ? {
          email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
          provider: 'email',
        } : {
          phoneNo: userFirebaseInfo.phoneNumber,
          provider: 'phone',
        } as any;

        const loginMethods = userFirebaseInfo.providerData.map((v: any) => {
          if (v.providerId === 'facebook.com') {
            return {
              uid: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].uid : '',
              email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
              provider: 'facebook',
            };
          } else if (v.providerId === 'google.com') {
            return {
              uid: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].uid : '',
              email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
              provider: 'google',
            };
          } else if (v.providerId === 'password') {
            return {
              email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
              provider: 'email',
            };
          } else {
            return {
              phoneNo: userFirebaseInfo.phoneNumber,
              provider: 'phone',
            };
          }
        });

        const newUser: Partial<User> = {
          ...data,
          id: userFirebaseInfo.uid,
          email: data.email ? data.email : (userFirebaseInfo.email || userFirebaseInfo.providerData[0].email),
          phoneNumber: data.phoneNumber ? data.phoneNumber : userFirebaseInfo.phoneNumber,
          familyName: firstName ? firstName : '',
          givenName: lastName ? lastName : '',
          fullName: data.name ? data.name : '',
          dob: data.dob ? new Date(data.dob).getTime() : undefined,
          avatar: data.avatar,
          loginDetail,
          loginMethods,
          roles: role.map((r) => r.id),
          isActive: true,
          isVerified: false,
          completeSignUp: false,
          appleIdentifierId: data.appleIdentifierId || undefined,
          createdBy: userFirebaseInfo.uid,
          createdAt: new Date().getTime(),
        };
        await params.repository.create(newUser as any);
        return {
          ...JSON.parse(JSON.stringify(newUser)),
          permissions: role ? uniq([].concat.apply([], role.map((r: any) => r.permissions))) : [],
          resetPasscode: {},
        };
      } else {
        // const updatedRole = data.role ? (await params.roleRepository.findRoleByName(data.role)).map((v: any) => v._id) : existedUser.roles;
        const loginMethods = userFirebaseInfo.providerData.map((v: any) => {
          if (v.providerId === 'facebook.com') {
            return {
              uid: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].uid : '',
              email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
              provider: 'facebook',
            };
          } else if (v.providerId === 'google.com') {
            return {
              uid: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].uid : '',
              email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
              provider: 'google',
            };
          } else if (v.providerId === 'password') {
            return {
              email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
              provider: 'email',
            };
          } else {
            return {
              phoneNo: userFirebaseInfo.phoneNumber,
              provider: 'phone',
            };
          }
        });
        await params.repository.update({
          id: verifyIdToken.uid,
          // familyName: firstName ? firstName : existedUser.firstName,
          // givenName: lastName ? lastName : existedUser.givenName,
          // fullName: data.name ? data.name : existedUser.fullName,
          // phoneNumber: data.phoneNumber ? data.phoneNumber : existedUser.phoneNumber,
          // roles: updatedRole,
          // email: data.email ? data.email : existedUser.email,
          loginMethods,
          // appleIdentifierId: data.appleIdentifierId ? data.appleIdentifierId : existedUser.appleIdentifierId,
        });
      }

      const userRole = await params.roleRepository.findByIds(existedUser.roles);

      if (!existedUser.isVerified && userRole && userRole.find((r) => r.name === 'tutor')) {
        throw new Error(params.translate('tutorIsNotVerified'));
      }

      return {
        ...JSON.parse(JSON.stringify(existedUser)),
        permissions: role ? uniq([].concat.apply([], userRole.map((r: any) => r.permissions))) : [],
        resetPasscode: {},
      };
    } else {
      const firstName = data.name ? data.name.split(' ')[0] : '';
      const lastName = data.name ? data.name.split(' ').slice(1, data.name.split(' ').length).join(' ') : '';
      if (data.appleId) {
        const existedUser = await params.repository.findById(data.appleId) as any;
        if (existedUser) {
          const updatedRole = data.role ? (await params.roleRepository.findRoleByName(data.role)).map((v: any) => v._id) : existedUser.roles;
          // await params.repository.update({
          //   id: data.appleId,
          //   familyName: firstName ? firstName : existedUser.firstName,
          //   givenName: lastName ? lastName : existedUser.givenName,
          //   fullName: data.name ? data.name : existedUser.fullName,
          //   phoneNumber: data.phoneNumber ? data.phoneNumber : existedUser.phoneNumber,
          //   roles: updatedRole,
          //   email: data.email ? data.email : existedUser.email,
          //   appleIdentifierId: data.appleIdentifierId ? data.appleIdentifierId : existedUser.appleIdentifierId,
          // });
          const userRole = await params.roleRepository.findByIds(updatedRole);
          const customToken = await admin.auth().createCustomToken(data.appleId);
          return {
            ...JSON.parse(JSON.stringify(existedUser)),
            permissions: role ? uniq([].concat.apply([], userRole.map((r: any) => r.permissions))) : [],
            resetPasscode: {},
            customToken,
          };
        } else {
          // Retrieve firebase data
          let userFirebaseInfo = undefined as any;
          try {
            userFirebaseInfo = await admin.auth().getUser(data.appleId);
          } catch (_err) {
            //
          }

          // Create a firebase user
          if (!userFirebaseInfo) {
            userFirebaseInfo = await admin.auth().createUser({
              uid: data.appleId,
              email: data.email,
              password: config.defaultPassword,
              emailVerified: true,
              displayName: data.name,
              disabled: false,
            });
            await admin.auth().setCustomUserClaims(data.appleId, {
              roles: role ? role.map((v: any) => ({
                name: v.name,
                _id: v._id,
              })) : undefined,
              avatarUrl: '',
              name: data.name,
            });
          }

          const loginDetail = userFirebaseInfo.providerData && userFirebaseInfo.providerData.length ? (userFirebaseInfo.providerData[0].providerId === 'facebook.com'
          ? {
            uid: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].uid : '',
            email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
            provider: 'facebook',
          } : userFirebaseInfo.providerData[0].providerId === 'google.com' ? {
            uid: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].uid : '',
            email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
            provider: 'google',
          } : userFirebaseInfo.providerData[0].providerId === 'password' ? {
            email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
            provider: 'email',
          } : {
            phoneNo: userFirebaseInfo.phoneNumber,
            provider: 'phone',
          }) : {
            email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
            provider: 'email',
          } as any;

          const loginMethods = userFirebaseInfo.providerData && userFirebaseInfo.providerData.length ? userFirebaseInfo.providerData.map((v: any) => {
            if (v.providerId === 'facebook.com') {
              return {
                uid: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].uid : '',
                email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
                provider: 'facebook',
              };
            } else if (v.providerId === 'google.com') {
              return {
                uid: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].uid : '',
                email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
                provider: 'google',
              };
            } else if (v.providerId === 'password') {
              return {
                email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
                provider: 'email',
              };
            } else {
              return {
                phoneNo: userFirebaseInfo.phoneNumber,
                provider: 'phone',
              };
            }
          }) : {
            email: userFirebaseInfo.providerData[0] ? userFirebaseInfo.providerData[0].email : '',
            provider: 'email',
          };

          // Create new mongo user
          const newUser: Partial<User> = {
            ...data,
            id: data.appleId,
            email: data.email,
            phoneNumber: data.phoneNumber,
            familyName: firstName ? firstName : '',
            givenName: lastName ? lastName : '',
            fullName: data.name ? data.name : '',
            dob: data.dob ? new Date(data.dob).getTime() : undefined,
            avatar: data.avatar,
            loginDetail,
            loginMethods,
            roles: role.map((r) => r.id),
            isActive: true,
            isVerified: false,
            completeSignUp: false,
            appleIdentifierId: data.appleIdentifierId || undefined,
            createdBy: data.appleId,
            createdAt: new Date().getTime(),
          };
          await params.repository.create(newUser as any);

          const customToken = await admin.auth().createCustomToken(data.appleId);
          return {
            ...JSON.parse(JSON.stringify(newUser)),
            permissions: role ? uniq([].concat.apply([], role.map((r: any) => r.permissions))) : [],
            resetPasscode: {},
            customToken,
          };
        }
      } else {
        throw new Error(params.translate('missingInput'));
      }
    }
  },
};

const sendResetCode = async (user: any) => {
  try {
    let code = String(Math.floor(Math.random() * 10000));
    if (code.length < 4) {
      const join = Array.apply(null, {length: 4 - code.length} as any).map(() => '0').join('');
      code = join + code;
    }
    const mailOptions = {
      // from: config.emailAccount.resetPassword.account,
      to: user.email,
      subject: 'Reset your account password',
      html: `<h4><b>Reset Password</b></h4>
      <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please use this code to complete your process: </p>
      <h3>${code}</h3>
      <br><br>
      <p>If you did not request this, please ignore this email and your password will remain unchanged</p>`,
    };
    await transporter.sendMail(mailOptions);
    await userRepository.update({
      id: user._id,
      resetPasscode: {
        code,
        createdAt: Date.now(),
      },
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default authService;
