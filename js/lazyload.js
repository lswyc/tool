function visible(elem){
    elem = $(elem)
    return !!(elem.width() || elem.height()) && elem.css("display") !== "none";
}


;(function($) {

    $.fn.unveil = function(threshold, callback) {

        var $w = $(window),
            th = threshold || 0,
            retina = window.devicePixelRatio > 1,
            attrib = retina? "data-src-retina" : "data-src",
            images = this,
            loaded;

        this.one("unveil", function() {
            var isTalipay = /t.alipayobjects.com/;
            var source = this.getAttribute(attrib);
            var postfix = this.getAttribute("data-postfix");
            source = source || this.getAttribute("data-src");
            source += isTalipay.test(source) ? postfix : '';
            if (source) {
                this.setAttribute("src", source);
                if (typeof callback === "function") callback.call(this);
            }
        });

        function unveil() {
            var inview = images.filter(function() {
                var $e = $(this);
                //if ($e.is(":hidden")) return;
                if (!visible($e)) return;

                var wt = $w.scrollTop(),
                    wb = wt + $w.height(),
                    et = $e.offset().top,
                    eb = et + $e.height();

                return eb >= wt - th && et <= wb + th;
            });

            loaded = inview.trigger("unveil");
            images = images.not(loaded);
        }

        $w.on("scroll.unveil resize.unveil lookup.unveil", unveil);

        unveil();

        return this;

    };

})(window.jQuery || window.Zepto);

$(function(){
    $("img[data-src]").unveil();
    $(window).trigger("lookup");

})
$(window).trigger("lookup");