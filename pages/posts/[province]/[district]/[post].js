import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { appConfig } from '../../../../constant';
import { useRouter } from 'next/router';
import axios from 'axios';
import * as postServices from '../../../../services/post/index';

import Layout from '../../../../components/Layout/Layout';

const convertChar = (string) => {
    string = string.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^\w\s]/g, '')
        .replace(/\s/g, '-').toLowerCase();

    return string;
};

export async function getStaticPaths() {
    let params = [];

    const res = await fetch(`${appConfig.API_VMOTEL}/post/get-paths`);
    const posts = await res.json();
    const { paths = [] } = posts.data;

    const newPaths = paths.map(path => {
        const title = convertChar(path.title);
        const province = convertChar(path.filter.province.name)
        const district = convertChar(path.filter.district.name)
        const id = path._id;

        return {
            params: {
                post: title + `"${id}"`,
                province,
                district,
            }
        }
    })

    return {
        paths: newPaths,
        fallback: false // See the "fallback" section below
    };
}

// This also gets called at build time
export async function getStaticProps(props) {
    const { params = {} } = props;

    const id = params.post.match(/"([^"]*)"/g)[0].replace(/"/g, '');

    const res = await fetch(`${appConfig.API_VMOTEL}/post/get-post/${id}`)
    const data = await res.json();

    // Pass post data to the page via props
    return { props: { postInfo: data.data.post } }
}

function Post(props) {
    const { postInfo } = props;

    const meta = {
        image: postInfo.images[0],
        title: postInfo.title
    }

    return (
        <Layout {...meta}>
            hello
            {postInfo.title}
        </Layout>
    )
}

Post.propTypes = {

}

export default Post

