(function(){

    //아이콘 리스트 팝업.
    oAPP.fn.callIconListPopup = function(retfunc){

        //아이콘 리스트 정보 얻기.
        var lt_icon = oAPP.attr.ui.frame.contentWindow.getIconList();

        //아이콘 리스트가 존재하지 않는경우 exit.
        if(typeof lt_icon === "undefined" || lt_icon.length === 0){return;}

        //메뉴 잠금 처리.

        //icon popup UI 생성.
        var oDlg = new sap.m.Dialog({title:"UI5 Icon List", resizable:true, draggable:true,
          contentWidth:"500px", contentHeight:"40%", horizontalScrolling:false});

        //dialog open전 icon list 구성.
        oDlg.attachBeforeOpen(function(){

            var lt_list = [], ls_list = {};
            
            //icon 정보를 기준으로 model data 구성.
            for(var i=0, l=lt_icon.length; i<l; i++){

                ls_list.nam = lt_icon[i];
                ls_list.src = "sap-icon://" + lt_icon[i];
                lt_list.push(ls_list);
                ls_list = {};

            }

            //model에 icon리스트 정보 세팅.
            oModel.setData({"T_ICON":lt_list});

        }); //dialog open전 icon list 구성.


        //model 정보.
        var oModel = new sap.ui.model.json.JSONModel();
        oDlg.setModel(oModel);


        //icon List UI 생성.
        var oTab = new sap.m.Table({growing:true, growingScrollToLoad:true, alternateRowColors:true,sticky:["HeaderToolbar"]});
        oDlg.addContent(oTab);

        //아이콘 선택(더블클릭) 이벤트.
        oTab.attachBrowserEvent("dblclick",function(oEvent){

            //callback function이 존재하지 않는경우 exit.
            if(typeof retfunc === "undefined"){return;}

            //더블클릭한 dom으로부터 UI 검색.
            var l_ui = oAPP.fn.getUiInstanceDOM(oEvent.target,sap.ui.getCore());

            //UI를 찾지 못한 경우 exit.
            if(typeof l_ui === "undefined"){return;}

            //UI의 meta정보를 얻기.
            var l_meta = l_ui.getMetadata();

            //text UI를 더블클릭한 경우 exit(text를 영역잡기 위한 더블클릭일 수 있으므로)
            if(l_meta._sClassName === "sap.m.Text"){return;}

            //해당 ui의 바인딩 정보 얻기.
            var l_ctxt = l_ui.getBindingContext();

            //바인딩 정보를 얻지 못한 경우 exit.
            if(typeof l_ctxt === "undefined"){return;}

            //icon 정보 얻기.
            var ls_icon = l_ctxt.getProperty();

            //callback function에 선택한 icon명 전달.
            retfunc(ls_icon.src);

            //아이콘 팝업 종료 처리.
            oDlg.close();

            //메시지 처리.
            parent.showMessage(sap, 10, "I", ls_icon.src + " selected.");

            //메뉴 잠금 해제 처리.

        }); //아이콘 선택(더블클릭) 이벤트.



        //검색조건 toolbar영역.
        var oTool = new sap.m.Toolbar();
        oTab.setHeaderToolbar(oTool);

        //검색조건 필드.
        var oSearch = new sap.m.SearchField({placeholder:"Search Icon"});
        oTool.addContent(oSearch);

        //검색 이벤트.
        oSearch.attachLiveChange(function(){
            
            //결과리스트 바인딩 정보 얻기.
            var l_bind = oTab.getBinding("items");

            //바인딩 정보를 얻지 못한 경우 exit.
            if(typeof l_bind === "undefined"){return;}

            //검색조건 입력값 얻기.
            var l_filter, l_val = this.getValue();

            //검색조건 값이 입력된경우 필터 정보 구성.
            if(l_val !== ""){
                l_filter = new sap.ui.model.Filter({path:"nam",operator:"Contains",value1:l_val});
            }

            //model 필터 처리.
            l_bind.filter(l_filter);

        }); //검색 이벤트.



        //List Item UI 생성.
        var oCItem = new sap.m.ColumnListItem({vAlign:"Middle"});
        oTab.bindAggregation("items",{path:"/T_ICON",template:oCItem});

        //icon 컬럼.
        var oCol1 = new sap.m.Column({width:"50px"});
        oTab.addColumn(oCol1);

        //icon명 컬럼.
        var oCol2 = new sap.m.Column();
        oTab.addColumn(oCol2);

        //copy 버튼 컬럼.
        var oCol3 = new sap.m.Column({width:"120px"});
        oTab.addColumn(oCol3);


        //icon.
        var oIcon = new sap.ui.core.Icon({size:"30px",src:"{src}"});
        oCItem.addCell(oIcon);

        //icon text.
        var oText = new sap.m.Text({text:"{src}"});
        oCItem.addCell(oText);

        //copy 버튼.
        var oCopy = new sap.m.Button({text:"Copy text", icon:"sap-icon://copy"});
        oCItem.addCell(oCopy);

        //copy 버튼 선택 이벤트.
        oCopy.attachPress(function(){

            //버튼선택 라인의 바인딩정보에 해당하는 값 얻기.
            var ls_icon = this.getBindingContext().getProperty();

            //이벤트 발생한 버튼의 dom 정보 얻기.
            var l_dom = this.getDomRef();

            //동적 input tag 생성.
            var l_inp = document.createElement("input");

            //생성한 input의 value에 복사대상 text 매핑.
            l_inp.value = ls_icon.src;

            //버튼 dom에 input을 임시로 추가.
            l_dom.appendChild(l_inp);

            //input 선택 처리.
            l_inp.select();

            //복사 기능 수행.
            document.execCommand("copy");

            //임시로 추가했던 input tag 제거 처리.
            l_dom.removeChild(l_inp);

            //메시지 처리.
            parent.showMessage(sap, 10, "I", ls_icon.src + " copied.");

        }); //copy 버튼 선택 이벤트.



        //닫기 버튼.
        var oClose = new sap.m.Button({text:"Close",icon:"sap-icon://decline",type:"Reject"});
        oDlg.addButton(oClose);

        //닫기버튼 이벤트.
        oClose.attachPress(function(){
            oDlg.close();
        });  //닫기버튼 이벤트.



        //icon list popup open.
        oDlg.open();


    };  //아이콘 리스트 팝업.

})();