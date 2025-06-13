window.TEXT_SEARCH_DATA = {
{%- for col in site.collections -%}
  '{{ col.label }}': [
  {%- for doc in col.docs -%}
    {
      title  : {{ doc.title | jsonify }},
      content: {{ doc.content | markdownify        /* full body */
                         | strip_html
                         | strip_newlines
                         | jsonify }},
      url    : {{ doc.url | relative_url | jsonify }}
    }{% unless forloop.last %},{% endunless %}
  {%- endfor -%}
  ]{% unless forloop.last %},{% endunless %}
{%- endfor -%}
};

