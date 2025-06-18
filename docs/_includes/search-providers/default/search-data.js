window.TEXT_SEARCH_DATA = {
  /* Posts (the default collection) */
  posts: [
  {%- for p in site.posts -%}
    {
      title  : {{ p.title | jsonify }},
      content: {{ p.content | markdownify | strip_html | strip_newlines | jsonify }},
      url    : {{ p.url | relative_url | jsonify }}
    }{% unless forloop.last %},{% endunless %}
  {%- endfor -%}
  ],

  /* Everything else that isn’t a draft/static asset */
  pages: [
  {%- assign pages = site.pages
       | where_exp:'item','item.dir !~ /^\/assets|^\/node_modules/'
       | where_exp:'item','item.data.draft != true' -%}
  {%- for pg in pages -%}
    {
      title  : {{ pg.title | default: pg.slug | jsonify }},
      content: {{ pg.content | markdownify | strip_html | strip_newlines | jsonify }},
      url    : {{ pg.url | relative_url | jsonify }}
    }{% unless forloop.last %},{% endunless %}
  {%- endfor -%}
  ]
};