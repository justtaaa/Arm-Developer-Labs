<script>
window.TEXT_SEARCH_DATA = {
  {%- for _collection in site.collections -%}
    '{{ _collection.label }}': [
      {%- for _article in _collection.docs -%}
        {
          'title': {{ _article.title | jsonify }},
          'content': {{ (_article.content | default: _article.excerpt | default: _article.description | strip_html | strip_newlines) | jsonify }},
          {%- include snippets/prepend-baseurl.html path=_article.url -%}
          {%- assign _url = __return -%}
          'url': {{ _url | jsonify }}
        }
        {%- unless forloop.last -%},{%- endunless -%}
      {%- endfor -%}
    ]
    {%- unless forloop.last -%},{%- endunless -%}
  {%- endfor -%}
};
</script>
