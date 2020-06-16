import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';
import {appConfig} from './constant';

const markDownPath = path.join(process.cwd(), 'Docs/Introduce');

export async function getMarkDown(content) {
    if (content) {
        // Use remark to convert markdown into HTML string
        const processedContent = await remark()
            .use(html)
            .process(content);

        const contentHtml = processedContent.toString();

        // Combine the data with the id
        return contentHtml;
    }
}

export function getListMarkDowns() {
    // Get file names under /posts
    const allMarkDownData = appConfig.introduces.map(introduce => {
        // Remove ".md" from file name to get id
        const id = introduce.id;

        // Read markdown file as string
        const fullPath = path.join(markDownPath, introduce.markDown);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the id
        return {
            id,
            background: introduce.background,
            contentHtml: matterResult.content,
            ...matterResult.data
        };
    });

    return allMarkDownData;
}

import {message} from 'antd'; 

export const capitalize = (s) => {
    if (typeof s !== 'string') {return ''}
    return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Hàm chuyển ký tự có dấu thành không dấu
 * @param {*} s 
 */
export const convertChar = (string) => {
    string = string.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');

    return string;
};

export const fortmatName = (key) => {
    if (key && typeof key === 'string') {
        switch (key) {
            case 'fullName':
                return 'Tên khách hàng';
            case 'sex':
                return 'Giới tính';
            case 'job':
                return 'Nghề nghiệp';
            case 'workPlace':
                return 'Nơi làm việc';
            case 'tempReg':
                return 'Đăng ký tạm trú';
            case 'address':
                return 'Địa chỉ';
            case 'dateBirth':
                return 'Ngày sinh';
            case 'email':
                return 'Địa chỉ email';
            case 'avatar':
                return 'Ảnh đại diện';
            case 'phoneNumber':
                return 'Số điện thoại';
            case 'codeUser':
                return 'Mã khách hàng';
            case 'male':
                return 'Name';
            case 'female':
                return 'Nữ';
            case 'note':
                return 'Ghi chú';
            case 'identifyFront':
                return 'Ảnh cmnd mặt trước';
            case 'identifyBack':
                return 'Ảnh cmnd mặt sau';
            default:
                return '';
        }
    }
};

export function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}