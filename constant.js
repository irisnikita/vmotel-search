export const appConfig = {
    API: 'https://api-gateway.vmotel.me/manager-service',
    API_VMOTEL: 'https://api-v1.vmotel.me',
    API_PLACE_GOOGLE: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
    API_UPLOAD: 'https://api.imgbb.com/1/upload?key=fb8a3978bba3f76129ef55ed7f87843e',
    ACCESS_TOKEN_SECERET: 'access-token-secret-nltruongvi',
    API_GOOGLE_KEY: 'AIzaSyBQKU00HuGXQn5dUpXgglymajiA3O7z3e4',
    API_MOMO_TEST: 'https://test-payment.momo.vn/gw_payment/transactionProcessor',
    SECRET_KEY_MOMO_TEST: 'QruhQQ2sauOQImz74EHxAAzR7thNak8z',
    ACCESS_KEY_MOMO_TEST: '81GwRfqAAaaIb78s',
    SEXS: [{id: 'male', value: 'Nam'}, {id: 'female', value: 'Nữ'}, {id: 'other', value: 'Khác'}],
    introduces: [
        {
            id: 'page-1',
            background: '/images/page-1',
            markDown: 'page-1.md'
        }
    ],
    optionTypes: [
        {id: 'all', value: 'Tất cả'},
        {id: 'phong-tro', value: 'Phòng trọ, nhà trọ'},
        {id: 'nguyen-can', value: 'Nhà thuê nguyên căn'},
        {id: 'can-ho', value: 'Căn hộ'}
    ],
    levelPost: [
        {id: 'normal', label: 'Normal post'},
        {id: 'hot', label: 'Hot-new'},
        {id: 'vip', label: 'Vip'}
    ],
    userMenus: [
        {id: 'tao-tin', value: 'Add new post', icon: 'icon-post_add'},
        {id: 'quan-ly-tin', value: 'Manage posts', icon: 'icon-library_books'},
        {id: 'thong-tin-ca-nhan', value: 'User information', icon: 'icon-person'},
        {id: 'log-out', value: 'Log out', icon: 'icon-logout', danger: true}
    ]
};