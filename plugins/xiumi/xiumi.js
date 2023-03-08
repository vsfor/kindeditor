/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/

// Baidu Maps: http://dev.baidu.com/wiki/map/index.php?title=%E9%A6%96%E9%A1%B5

KindEditor.plugin('xiumi', function(K) {
    var self = this, name = 'xiumi', lang = self.lang(name + '.');
    var mapWidth = K.undef(self.mapWidth, '1080px');
    var mapHeight = K.undef(self.mapHeight, '500px');
    self.clickToolbar(name, function() {
        var html = ['',
            '<div class="ke-xiumi" style="width:' + mapWidth + ';height:' + mapHeight + ';"></div>',
            ''].join('');
        var dialog = self.createDialog({
            name : name,
            width : mapWidth + 42,
            title : self.lang(name),
            body : html,
            yesBtn : {
                name : self.lang('yes'),
                click : function(e) {
                    if (xmData) {
                        xmData = xmData.replace(/class=\"Powered-by-XIUMI\ V5\"/g,'')
                            .replace(/powered-by=\"xiumi\.us\"/g,'');
                        self.insertHtml(xmData + '<p><br/></p><br/>');
                        self.hideDialog().focus();
                        xmData = null;
                    } else if(confirm('没有选中任何内容，确认"放弃编辑"？')) {
                        self.hideDialog().focus();
                    }
                }
            },
            beforeRemove : function() {
                if (doc) {
                    doc.write('');
                }
                iframe.remove();
            }
        });
        var div = dialog.div,
            win, doc, xmData;
        var iframe = K('<iframe class="ke-textarea" frameborder="0" src="' + self.pluginsPath + 'xiumi/xiumi-v5.html" style="width:' + mapWidth + ';height:' + mapHeight + ';"></iframe>');
        function ready() {
            win = iframe[0].contentWindow;
            doc = K.iframeDoc(iframe);

            win.addEventListener('message', function (event) {
                console.log('message event----', event);
                if (event.origin == "https://xiumi.us") {
                    xmData = event.data;
                    // editor.execCommand('insertHtml', event.data);
                    // editor.fireEvent("catchRemoteImage");
                    // dialog.close();
                }
            }, false);
        }
        iframe.bind('load', function() {
            iframe.unbind('load');
            if (K.IE) {
                ready();
            } else {
                setTimeout(ready, 0);
            }
        });
        K('.ke-xiumi', div).replaceWith(iframe);
    });
});
