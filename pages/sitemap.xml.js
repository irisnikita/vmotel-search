import React from 'react';
import axios from 'axios';
import { appConfig } from '../constant';

const sitemapXml = data => {
  let latestPost = 0;
  let projectsXML = '';

  data = data || [{ province: 'ho-chi-minh', district: 'tan-phu', title: 'cho-thue-phong-moi-co-gac-gio-giac-tu-do-may-lanh-tai-133-son-ky-lh-0938133991--km-giam-10-2-thang', id: "5ef62eb76623330024909a0f" }];

  data.map(post => {
    const postDate = Date.parse(post.modified);

    if (!latestPost || postDate > latestPost) {
      latestPost = postDate;
    }

    const projectURL = `https://vmotel.me/posts/${post.province}/${post.district}/${post.title}"${post.id}"`;

    projectsXML += `
      <url>
        <loc>${projectURL}</loc>
        <priority>0.70</priority>
      </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://vmotel.me/</loc>
        <priority>1.00</priority>
      </url>
      ${projectsXML}
    </urlset>`;
};

class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    const response = await fetch(`${appConfig.API_VMOTEL}/post/get-paths`);
    const data = await response.json();

    if (data && data.data && data.data.paths) {
		const { paths } = data.data;

		res.setHeader('Content-Type', 'text/xml');
		res.write(sitemapXml(paths));
		res.end();
    } else {
		res.setHeader('Content-Type', 'text/xml');
		res.write(sitemapXml());
		res.end();
    }

  }
}

export default Sitemap;