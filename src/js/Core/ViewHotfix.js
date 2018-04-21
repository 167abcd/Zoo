
(function () { //fix refreshView
    var _forceRefreshView = newui.TableView.prototype.forceRefreshView;

    newui.TableView.prototype.forceRefreshView = function () {
        var node = this;
        while(node){
            if(!node.isVisible()){
                return;
            }
            node = node.getParent();
        }

        var direction = this.getDirection();
        if(direction === ccui.ScrollView.DIR_VERTICAL){
            var oldSize = this.getInnerContainerSize();
            if(oldSize.width === 0 || oldSize.height === 0){
                return;
            }
            var oldPoint = this.getInnerContainerPosition();
            _forceRefreshView.apply(this, arguments);
            var newSize = this.getInnerContainerSize();

            var newPoint = cc.p(oldPoint.x, oldPoint.y + oldSize.height - newSize.height);
            var maxY = 0;
            var minY = this.getContentSize().height - newSize.height;
            if(newPoint.y < minY){
                newPoint.y = minY;
            }
            if(newPoint.y > maxY){
                newPoint.y = maxY;
            }
            this.setInnerContainerPosition(newPoint);
        }
        else{
            _forceRefreshView.apply(this, arguments);
        }
    };
})();