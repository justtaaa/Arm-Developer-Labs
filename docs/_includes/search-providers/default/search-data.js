---
layout: null
---

/*  Auto-generated at build time  */
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

  /* All regular pages except static assets */
  pages: [
  {%- assign docs = site.pages
       | where_exp:'d','d.path contains \"/_site/\" or d.path contains \"/docs/\"'  -%}
  {%- for pg in docs -%}
    {
      "title"  : {{ pg.title | default: pg.slug | jsonify }},
      "content": {{ pg.content | markdownify
                             | strip_html
                             | strip_newlines
                             | jsonify }},
      "url"    : {{ pg.url | relative_url | jsonify }}
    }{% unless forloop.last %},{% endunless %}
  {%- endfor -%}
  ]
};
