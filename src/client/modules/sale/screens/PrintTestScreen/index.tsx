import React, { useRef } from 'react';
import { Card } from 'antd';
import ReactToPrint from 'react-to-print';

import './styles.less';

class ComponentToPrint extends React.Component {
  render() {
    return (
      // <div id='print-area'>
      <div className='print-container print-transform'>
        <div className='print-header'>
          <div className='print-header-info'>
            <div className='header-info-text'>CÔNG TY TNHH MTV CỌ VIỆT MỸ</div>
            <div className='header-info-text'>ĐT: 38767888 - 3755488; Fax: (848) 3755 1128 </div>
            <div className='header-info-text'>Email: info@vietmybrush.vn </div>
          </div>
          <div className='print-header-title'>
            <div className='print-big-title'>BIÊN NHẬN</div>
            <div className='header-info-text'>Số 336 - Ngày 19/5/2020 </div>
          </div>
        </div>
        <div className='client-info'>
          <div className='client-info-detail'>
            <div className='client-code-text'>Mã KH</div>
            <div className='client-code-container'>T08</div>
            <div className='client-name'>Tiệm sơn Mỹ Danh</div>
          </div>
          <div>
            <div className='header-info-text'>ĐT: 37431324 </div>
          </div>
        </div>
        <p className='client-address'>293 Nguyễn Duy Trinh, P Bình Trưng Đông Quận 2, TPHCM</p>
        <table className='product-table'>
          <tr className='product-table-header'>
            <th className='stt'>STT</th>
            <th className='product-code'>MHH</th>
            <th className='product-item'>HÀNG HOÁ</th>
            <th className='dvt'>ĐVT</th>
            <th className='product-quantity'>SL</th>
            <th className='product-price'>ĐƠN GIÁ</th>
            <th className='product-total-price'>THÀNH TIỀN</th>
          </tr>
          <tr>
            <td>1</td>
            <td>Z30</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>100</td>
            <td className='price'>10.800</td>
            <td className='price'>900.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>1</td>
            <td>Z30</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>100</td>
            <td className='price'>10.800</td>
            <td className='price'>900.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>1</td>
            <td>Z30</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>100</td>
            <td className='price'>10.800</td>
            <td className='price'>900.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td colSpan={3} rowSpan={4} className='discount-section'>
              KHI THANH TOÁN TRONG KỲ SẼ ĐƯỢC
            </td>
          </tr>
          <tr className='upper-border-section'>
            <td colSpan={2} className='no-border-right'>
              CỘNG TIỀN
            </td>
            <td className='no-border-right'></td>
            <td className='right-text'>2.000.000</td>
          </tr>
          <tr>
            <td colSpan={2} className='no-border-right'>
              KHẤU TRỪ
            </td>
            <td className='no-border-right center-text'>13%</td>
            <td className='right-text'>-266.656</td>
          </tr>
          <tr className='bottom-border-section'>
            <td colSpan={2} className='no-border-right'>
              CÒN LẠI
            </td>
            <td className='no-border-right center-text'>(A)</td>
            <td className='right-text'>1.784.544</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td colSpan={5} rowSpan={4} className='discount-section right-text'>
              CỘNG TIỀN
            </td>
          </tr>
          <tr className='right-text border-top'>
            <td className='no-border-right'></td>
            <td>210.000</td>
          </tr>
          <tr className='right-text'>
            <td className='no-border-right'></td>
            <td>0</td>
          </tr>
          <tr className='right-text'>
            <td className='no-border-right'>B</td>
            <td>210.000</td>
          </tr>
          <tr>
            <td className='center-text' colSpan={6}>
              TỔNG CỘNG (A) + (B)
            </td>
            <td className='border-top right-text'>1.994.544</td>
          </tr>
        </table>
        <div className='signing'>
          <div>NGƯỜI NHẬN HÀNG</div>
          <div>NGƯỜI GIAO HÀNG</div>
          <div>NGƯỜI LẬP B/N</div>
        </div>
      </div>
      // </div>
    );
  }
}

const Screen = () => {
  const componentRef = useRef();

  return (
    <Card style={{ marginTop: 30 }}>
      <h1>Hoá đơn</h1>
      <div className='print-container'>
        <div className='print-header'>
          <div className='print-header-info'>
            <div className='header-info-text'>CÔNG TY TNHH MTV CỌ VIỆT MỸ</div>
            <div className='header-info-text'>ĐT: 38767888 - 3755488; Fax: (848) 3755 1128 </div>
            <div className='header-info-text'>Email: info@vietmybrush.vn </div>
          </div>
          <div className='print-header-title'>
            <div className='print-big-title'>BIÊN NHẬN</div>
            <div className='header-info-text'>Số 336 - Ngày 19/5/2020 </div>
          </div>
        </div>
        <div className='client-info'>
          <div className='client-info-detail'>
            <div className='client-code-text'>Mã KH</div>
            <div className='client-code-container'>T08</div>
            <div className='client-name'>Tiệm sơn Mỹ Danh</div>
          </div>
          <div>
            <div className='header-info-text'>ĐT: 37431324 </div>
          </div>
        </div>
        <p className='client-address'>293 Nguyễn Duy Trinh, P Bình Trưng Đông Quận 2, TPHCM</p>
        <table className='product-table'>
          <tr className='product-table-header'>
            <th className='stt'>STT</th>
            <th className='product-code'>MHH</th>
            <th className='product-item'>HÀNG HOÁ</th>
            <th className='dvt'>ĐVT</th>
            <th className='product-quantity'>SL</th>
            <th className='product-price'>ĐƠN GIÁ</th>
            <th className='product-total-price'>THÀNH TIỀN</th>
          </tr>
          <tr>
            <td>1</td>
            <td>Z30</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>100</td>
            <td className='price'>10.800</td>
            <td className='price'>900.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>1</td>
            <td>Z30</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>100</td>
            <td className='price'>10.800</td>
            <td className='price'>900.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>1</td>
            <td>Z30</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>100</td>
            <td className='price'>10.800</td>
            <td className='price'>900.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td colSpan={3} rowSpan={4} className='discount-section'>
              KHI THANH TOÁN TRONG KỲ SẼ ĐƯỢC
            </td>
          </tr>
          <tr className='upper-border-section'>
            <td colSpan={2} className='no-border-right'>
              CỘNG TIỀN
            </td>
            <td className='no-border-right'></td>
            <td className='right-text'>2.000.000</td>
          </tr>
          <tr>
            <td colSpan={2} className='no-border-right'>
              KHẤU TRỪ
            </td>
            <td className='no-border-right center-text'>13%</td>
            <td className='right-text'>-266.656</td>
          </tr>
          <tr className='bottom-border-section'>
            <td colSpan={2} className='no-border-right'>
              CÒN LẠI
            </td>
            <td className='no-border-right center-text'>(A)</td>
            <td className='right-text'>1.784.544</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Z25</td>
            <td>Lăn sơn việt mỹ, dài 11 cm</td>
            <td className='product-table-header'>Cây</td>
            <td className='product-table-header'>50</td>
            <td className='price'>100.800</td>
            <td className='price'>1.000.800</td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td className='product-table-header'></td>
            <td className='product-table-header'></td>
            <td className='price'></td>
            <td className='price'></td>
          </tr>
          <tr>
            <td colSpan={5} rowSpan={4} className='discount-section right-text'>
              CỘNG TIỀN
            </td>
          </tr>
          <tr className='right-text border-top'>
            <td className='no-border-right'></td>
            <td>210.000</td>
          </tr>
          <tr className='right-text'>
            <td className='no-border-right'></td>
            <td>0</td>
          </tr>
          <tr className='right-text'>
            <td className='no-border-right'>B</td>
            <td>210.000</td>
          </tr>
          <tr>
            <td className='center-text' colSpan={6}>
              TỔNG CỘNG (A) + (B)
            </td>
            <td className='border-top right-text'>1.994.544</td>
          </tr>
        </table>
        <div className='signing'>
          <div>NGƯỜI NHẬN HÀNG</div>
          <div>NGƯỜI GIAO HÀNG</div>
          <div>NGƯỜI LẬP B/N</div>
        </div>
      </div>
      <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
        bodyClass={'print-container'}
      />
      <ComponentToPrint ref={componentRef} />
    </Card>
  );
};

export const PrintScreen = Screen;
