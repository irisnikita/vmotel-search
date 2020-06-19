import React from 'react'

export async function getStaticPaths() {

    return {
        paths: [
            {
                params: { id: 'anh-yeu-em' }
            }
        ],
        fallback: false // See the "fallback" section below
    };
}

// This also gets called at build time
export async function getStaticProps({ params }) {

    // Pass post data to the page via props
    return { props: { hello: 'hewi' } }
}

export default function blog() {
    return (
        <div>
            hello
        </div>
    )
}
