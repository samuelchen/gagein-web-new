{{#news.items}}
<li class="fclear">
    <div class="news-list-l fl">
        <a href="#"><img src="{{{widget_path}}}{{company_pic}}" alt="#"/></a>
        <a href="#"><img src="{{{widget_path}}}{{people_pic}}" alt="#"/></a>
    </div>
    <div class="news-list-r fl">
        <a href="#"><h2 class="black-h1">{{title}}</h2></a>
        <p class="gray-cnt">{{content}}</p>
        <span class="gray-desc">{{desc}}</span>
        <div class="news-icon">
            <a href="#" class="news-icon-bookmark" bid="{{id}}">Bookmark</a>
        </div>
    </div>
</li>
{{/news.items}}