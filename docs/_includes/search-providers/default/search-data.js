---
---
layout: null  
---

/*  Auto-generated at build time; do not edit by hand  */
window.TEXT_SEARCH_DATA = {
  /* Blog posts */
  posts: [
  {%- for p in site.posts -%}
    {
      "title"  : {{ p.title | jsonify }},
      "content": {{ p.content | markdownify
                             | strip_html
                             | strip_newlines
                             | jsonify }},
      "url"    : {{ p.url | relative_url | jsonify }}
    }{% unless forloop.last %},{% endunless %}
  {%- endfor -%}
  ],

  /* Regular pages (skip obvious static assets) */
  pages: [
  {%- for pg in site.pages -%}
    {%- unless pg.path contains 'assets/' or pg.path contains 'node_modules/' or pg.name == '404.html' -%}
    {
      "title"  : {{ pg.title | default: pg.slug | jsonify }},
      "content": {{ pg.content | markdownify
                             | strip_html
                             | strip_newlines
                             | jsonify }},
      "url"    : {{ pg.url | relative_url | jsonify }}
    }{% unless forloop.last %},{% endunless %}
    {%- endunless -%}
  {%- endfor -%}
  ]
};
