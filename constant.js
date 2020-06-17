export const appConfig = {
    API: 'http://127.0.0.1:8000',
    API_VMOTEL: 'http://127.0.0.1:8079',
    API_UPLOAD: 'https://api.imgbb.com/1/upload?key=fb8a3978bba3f76129ef55ed7f87843e',
    ACCESS_TOKEN_SECERET: 'access-token-secret-nltruongvi',
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
    ]
};