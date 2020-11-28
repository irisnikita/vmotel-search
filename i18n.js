import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        translation: {
            'Welcome to React': 'Welcome to Reactdqwdwq and react-i18next',
            'vietnamese': 'Vietnamese',
            'english': 'English',
            'sign-in': 'Sign in',
            'register': 'Register',
            'post': 'Post',
            'place-to-search': 'Place to search',
            'Website to search motel, apartment': 'Website to search motel, apartment',
            'introduce': 'You worry when you cannot find a place to live, the cost is too high, the security is not good, the room is disordered. With Vmotel-Search, you can not only find a satisfied room, low cost, good security, but also the quality and reputation of a room and apartment.',
            'search-room': 'Search',
            'all': 'All',
            'price': 'Price',
            'address': 'Address',
            'month': 'Month',
            'Select post': 'Select post',
            'Provinces': 'Provinces',
            'District': 'District',
            'Street': 'Street',
            'Tất cả': 'All',
            'area': 'Area',
            'Select area': 'Select area',
            'Select prices': 'Select prices',
            'Cancel': 'Cancel',
            'Apply': 'Apply',
            'Minimum area': 'Minium area',
            'Maximum area': 'Maximum area',
            'Minimum price': 'Minium price',
            'Maximum price': 'Maximum price',
            'Read post': 'Read post',
            'Address detail': 'Address detail',
            'Input address': 'Input address',
            'Address': 'Address',
            'Information': 'Information',
            'Type post': 'Type post',
            'Title': 'Title',
            'Images': 'Images'
        }
    },
    vi: {
        translation: {
            'Welcome to React': 'Hello mọi người',
            'vietnamese': 'Tiếng Việt',
            'english': 'Tiếng Anh',
            'sign-in': 'Đăng nhập',
            'register': 'Đăng ký',
            'post': 'Đăng tin',
            'place-to-search': 'Nhập để tìm kiếm',
            'Website to search motel, apartment': 'Trang web tìm kiếm nhà trọ, căn hộ, phòng ở.',
            'introduce': 'Bạn lo lắng khi không tìm được nơi ở, chi phí quá cao, an ninh không tốt, phòng xuống cấp trật chội. Với Vmotel-Search, bạn không những có thể tìm được phòng ưng ý, chi phí thấp, an ninh tốt mà còn xem được chất lượng và uy tín của phòng trọ, căn hộ.',
            'search-room': 'Tìm phòng',
            'all': 'Tất cả',
            'price': 'Giá',
            'address': 'Địa chỉ',
            'month': 'Tháng',
            'Select post': 'Chọn tin',
            'Provinces': 'Tỉnh thành',
            'District': 'Quận huyện',
            'Street': 'Đường',
            'Tất cả': 'Tất cả',
            'area': 'Diện tích',
            'Select area': 'Chọn diện tích',
            'Select prices': 'Chọn khoảng giá',
            'Cancel': 'Hủy',
            'Apply': 'Áp dụng',
            'Minimum area': 'Diện tích tối thiểu',
            'Maximum area': 'Diện tích tối đa',
            'Minimum price': 'Giá tối thiểu',
            'Maximum price': 'Giá tối đa',
            'Read post': 'Xem tin',
            'Address detail': 'Địa chỉ chính xác',
            'Input address': 'Nhập địa chỉ',
            'Address': 'Địa chỉ',
            'Information': 'Thông tin',
            'Type post': 'Loại bài đăng',
            'Title': 'Tiêu đề',
            'Images': 'Hình ảnh',
            'Type of post': 'Loại tin',
            'Code': 'Mã tin',
            'Province': 'Tỉnh, Thành phố',
            'Area': 'Diện tích',
            'Price': 'Giá',
            'Status': 'Trạng thái',
            'Running': 'Đang hoạt động',
            'Date Submitted': 'Ngày đăng',
            'End date': 'Ngày kết thúc',
            'Actions': 'Hành động',
            'Package': 'Gói tin',
            'Manage posts': 'Quản lý tin',
            'Stopped': 'Tạm dừng',
            'Preview post': 'Xem bài',
            'Log out': 'Đăng xuất',
            'Add post': 'Đăng tin',
            'Your post had been hided': 'Bài của bạn đã bị ẩn',
            'Please show post to get this link': 'Hãy ấn nút hiện bài để có thể truy cập vào link trên',
            'User information': 'Thông tin cá nhân',
            'No data': 'Không có dữ liệu',
            'Add FeedBack Success': 'Đăng phản hồi thành công',
            'Terrible': 'Khủng khiếp', 'Bad': 'Tệ', 'Normal': 'Bình thường', 'Good': 'Tốt', 'Wonderful': 'Tuyệt vời',
            'Notice when add new post': 'Chú ý khi đăng bài',
            'GENERAL INFO': 'TIN CHUNG',
            'DETAILS': 'CHI TIẾT',
            'MAP': 'BẢN ĐỒ',
            'IMAGES': 'HÌNH ẢNH',
            'User name': 'Tên người đăng',
            'Email': 'Địa chỉ email',
            'Description': 'Nội dung',
            'Place your description': 'Nhập nội dung',
            'Submit': 'Đăng',
            'Vip': 'Tin vip',
            'NEWS': "TIN MỚI",
            'NEW POST': "TIN MỚI ĐĂNG",
            'CATEGORY': "DANH MỤC",
            'See all': "Xem tất cả",
            'See more': "Xem thêm",
            'Nice room, clean': "Phòng đẹp, sạch sẽ",
            'Vmotel will give priority to proposing rooms with beautiful spaces, cool, comfortable, full facilities.': "Vmotel sẽ ưu tiên đề xuất những căn phòng mang lại không gian đẹp, thoáng mát, thoải mái, đầy đủ tiện nghi.",
            'Affordability, cheap': "Chi phí hợp lý, giá rẻ",
            'For students going to the city to study, have limited economy, Vmotel will find you affordable rooms': "Đối với những sinh viên lên thành phố học, kinh tế hạn hẹp, Vmotel sẽ tìm cho bạn những căn phòng vừa hợp túi tiền",
            'Motel room for rent': 'Cho thuê phòng trọ',
            'cheap, convenient, safe, prestige Vietnam': 'giá rẻ, tiện nghi, an toàn, uy tín Việt Nam',
            'Motel room for rent the best, cheap, convenient, safe, prestige Vietnam': 'Cho thuê phòng trọ số 1, giá rẻ, tiện nghi, an toàn, uy tín Việt Nam',
            'You are afraid of scams, unsafe security, wrong prices, with Vmotel you can feel secure when choosing a room.': 'Bạn sợ lừa đảo, an ninh không an toàn, giá bị hớ,s với Vmotel bạn có thể an tâm khi chọn phòng.',
            'Hot': 'Tin nổi bật',
            'HOT': 'TIN NỔI BẬT',
            'Map': 'Bản đồ',
            'Motel room, apartment for rent': 'Cho thuê phòng trọ, căn hộ',
            'Phone Number': 'Số điện thoại',
            'User Name': 'Tên tài khoản',
            'Name': 'Họ và tên',
            'Number': 'Số nhà',
            'Ward': 'Phường',
            'Contact': 'Liên hệ',
            'Post new': 'Đăng bài',
            'Edit': 'Chỉnh sửa'
        }
    }
};

function getLocalStorage() {
    let defaultLang = 'vi';

    if (process.browser) {
        let lang = localStorage.getItem('lang');

        if (lang) {
            defaultLang = lang;
        } else {
            localStorage.setItem('lang', 'vi');
        }
    }

    return defaultLang;

}

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: getLocalStorage(),

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;