(function(){
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //  oAPP.fn.callDesignContextMenu
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //  디자인영역(미리보기)의 CONTEXT MENU 기능.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //  sArea  : CONTEXT MENU를 호출한 영역(design:좌측 DESIGN TREE 영역, preview:가운데 미리보기 영역)
    //  oEvent : window event
    //  oCore  : sap.ui.core Instance(미리보기 영역때문에 파라메터로 받음)
    //////////////////////////////////////////////////////////////////////////////////////////////////
    oAPP.fn.callDesignContextMenu = function(sArea, oEvent, oCore){
        
        //dom 기준으로 UI정보 얻기.
        var l_ui = oAPP.fn.getUiInstanceDOM(oEvent.target, oCore);

        var l_OBJID = "";

        //CONTEXT 메뉴를 호출한 영역에 따른 분기.
        switch(sArea){
            case "design":  //좌측 DESIGN TREE 영역
                l_OBJID = l_ui.getBindingContext().getProperty("OBJID");
                break;

            case "preview": //가운데 미리보기 영역.
                l_OBJID = l_ui._OBJID;
                break;

            default:
                return;
        }

        //OBJID를 찾지못한 경우 EXIT.
        if(typeof l_OBJID === "undefined" || l_OBJID === ""){return;}

        
        //MENU UI생성.
        var oMenu1 = new sap.m.Menu();

        //UI 추가 메뉴
        var oMItem1 = new sap.m.MenuItem({icon:"sap-icon://add",text:"Insert Element",enabled:"{/lcmenu/enab01}"});
        oMenu1.addItem(oMItem1);

        //UI 삭제 메뉴
        var oMItem2 = new sap.m.MenuItem({icon:"sap-icon://delete",text:"Delete",enabled:"{/lcmenu/enab02}"});
        oMenu1.addItem(oMItem2);

        //UI up
        var oMItem3 = new sap.m.MenuItem({icon:"sap-icon://navigation-up-arrow",text:"Up",enabled:"{/lcmenu/enab03}"});
        oMenu1.addItem(oMItem3);

        //UI down
        var oMItem4 = new sap.m.MenuItem({icon:"sap-icon://navigation-down-arrow",text:"Down",enabled:"{/lcmenu/enab04}"});
        oMenu1.addItem(oMItem4);

        //UI move Position
        var oMItem5 = new sap.m.MenuItem({icon:"sap-icon://outdent",text:"Move Position",enabled:"{/lcmenu/enab05}"});
        oMenu1.addItem(oMItem5);

        //copy 메뉴.
        var oMItem6 = new sap.m.MenuItem({icon:"sap-icon://copy",text:"Copy",enabled:"{/lcmenu/enab06}"});
        oMenu1.addItem(oMItem6);

        //paste 메뉴.
        var oMItem7 = new sap.m.MenuItem({icon:"sap-icon://paste",text:"Paste",enabled:"{/lcmenu/enab07}"});
        oMenu1.addItem(oMItem7);

        //CONTEXT MENU OPEN전 메뉴 활성/비활성처리
        oAPP.fn.enableDesignContextMenu(l_OBJID);

        //CONTEXT MENU를 이벤트 발생 DOM에 OPEN처리.
        oMenu1.openAsContextMenu(oEvent, oEvent.target);


    };  //디자인영역(미리보기)의 CONTEXT MENU 기능.




    //////////////////////////////////////////////////////////////////////////////////////////////////
    //  oAPP.fn.enableDesignContextMenu
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //  디자인영역 context menu 활성여부 설정.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //  OBJID  : UI OBJECT ID(BUTTON1)
    //////////////////////////////////////////////////////////////////////////////////////////////////
    oAPP.fn.enableDesignContextMenu = function(OBJID){

        var ls_menu = {};

        //default 메뉴 항목 잠금 상태로 설정.
        ls_menu.enab01 = false;   //ui추가 불가
        ls_menu.enab02 = false;   //ui삭제 불가
        ls_menu.enab03 = false;   //ui up 불가
        ls_menu.enab04 = false;   //ui down 불가
        ls_menu.enab05 = false;   //ui move position 불가
        ls_menu.enab06 = false;   //copy 불가
        ls_menu.enab07 = false;   //paste 불가

        //ROOT(DOCUMENT)영역인경우 모든 CONTEXT MENU 비활성 처리.
        if(OBJID === "ROOT"){
            oAPP.attr.oModel.setProperty('/lcmenu',ls_menu);

            //TREE ITEM 선택처리.
            oAPP.fn.setSelectTreeItem(OBJID);
            return;
        }

        //edit 상태인경우.(APP에서 CONTEXT MENU호출건을 처리하기위함)
        if(oAPP.attr.oModel.oData.IS_EDIT === true){
            ls_menu.enab01 = true; //ui추가 가능

            //복사된건 history 존재여부에 따른 붙여넣기 메뉴 활성화 여부 설정.
            ls_menu.enab07 = oAPP.fn.isExistsCopyData('U4AWSuiDesignArea');

        }

        //APP에서 menu 호출한 경우 편집 여부에 따라 UI추가, UI붙여넣기 메뉴만 사용 가능.
        if(OBJID === "APP"){
            oAPP.attr.oModel.setProperty('/lcmenu',ls_menu);

            //TREE ITEM 선택처리.
            oAPP.fn.setSelectTreeItem(OBJID);
            return;
        }

        //DOCUMENT, APP가 아닌 영역에서 CONTEXT MENU 호출시 display 상태인경우 메뉴 비활성 처리.
        if(oAPP.attr.oModel.oData.IS_EDIT === false){
            ls_menu.enab06 = true; //copy 가능
            oAPP.attr.oModel.setProperty('/lcmenu',ls_menu);

            //TREE ITEM 선택처리.
            oAPP.fn.setSelectTreeItem(OBJID);
            return;
        }

        //DOCUMENT, APP가 아닌 영역에서 편집 가능한 상태일때 CONTEXT MENU 호출시 하위 로직 수행.

        //현재 라인 정보 얻기.
        var ls_tree = oAPP.fn.getTreeData(OBJID);

        //부모 정보 얻기
        var l_parent = oAPP.fn.getTreeData(ls_tree.POBID);

        //menu 선택한 위치 얻기.
        var l_pos = l_parent.zTREE.findIndex( a=> a.OBJID === OBJID);

        //default 설정.
        ls_menu.enab01 = true;   //ui추가 가능
        ls_menu.enab02 = true;   //ui삭제 가능
        ls_menu.enab03 = true;   //ui up 가능
        ls_menu.enab04 = true;   //ui down 가능
        ls_menu.enab05 = true;   //ui move position 가능
        ls_menu.enab06 = true;   //ui copy 활성화.

        //복사된건 history 존재여부에 따른 붙여넣기 메뉴 활성화 여부 설정.
        ls_menu.enab07 = oAPP.fn.isExistsCopyData('U4AWSuiDesignArea');

        //부모의 child정보가 1건인경우.
        if(l_parent.zTREE.length === 1){
            ls_menu.enab03 = false;   //ui up 불가능
            ls_menu.enab04 = false;   //ui down 불가능
            ls_menu.enab05 = false;   //ui down 불가능

        }else if(l_pos === 0){
            //menu를 선택한 위치가 child중 첫번째라면
            ls_menu.enab03 = false; //ui up 불가능

        }else if(l_pos+1 === l_parent.zTREE.length){
            //menu를 선택한 위치가 child중 마지막이라면.
            ls_menu.enab04 = false;   //ui down 불가능

        }

        oAPP.attr.oModel.setProperty('/lcmenu',ls_menu);

        oAPP.fn.setSelectTreeItem(OBJID);

    };  //디자인영역 context menu 활성여부 설정.

})();