import React from 'react';
import Link from 'next/link';

export default function Page2() {
    return (
        <div>
            mia may
            <Link href='/'>
                <a>
                    page 1
                </a>
            </Link>
        </div>
    );
}
