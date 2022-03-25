(function(){

    //디자인영역(미리보기)의 CONTEXT MENU UI 구성.
    oAPP.fn.callDesignContextMenu = function(){
        
        //context menu popover UI생성.
        var oPop = new sap.m.ResponsivePopover({placement:"Auto", titleAlignment:"Center", title:"{/lcmenu/title}"});

        oPop.attachBeforeOpen(function(){
            //popup 호출전 이전 선택건 초기화 처리.
            oMenu1.clearSelection();
        });

        //context menu popover에 모델 설정.
        oPop.setModel(oAPP.attr.oModel);

        //MENU UI생성.
        var oMenu1 = new sap.m.SelectList();
        oPop.addContent(oMenu1);

        //menu item 선택 이벤트.
        oMenu1.attachItemPress(function(oEvent){
            //메뉴 item선택건에 따른 기능 분기 처리.
            oAPP.fn.contextMenuItemPress(oEvent);

            //메뉴 선택 후 popup종료 처리.
            oAPP.fn.contextMenuClosePopup(oPop);
            
        }); //menu item 선택 이벤트.

        //UI 추가 메뉴
        var oMItem1 = new sap.m.MenuItem({key:"M01", icon:"sap-icon://add", text:"Insert Element", enabled:"{/lcmenu/enab01}"});
        oMenu1.addItem(oMItem1);

        //UI 삭제 메뉴
        var oMItem2 = new sap.m.MenuItem({key:"M02", icon:"sap-icon://delete", text:"Delete", enabled:"{/lcmenu/enab02}"});
        oMenu1.addItem(oMItem2);

        //UI up
        var oMItem3 = new sap.m.MenuItem({key:"M03", icon:"sap-icon://navigation-up-arrow", text:"Up", enabled:"{/lcmenu/enab03}"});
        oMenu1.addItem(oMItem3);

        //UI down
        var oMItem4 = new sap.m.MenuItem({key:"M04", icon:"sap-icon://navigation-down-arrow", text:"Down",enabled:"{/lcmenu/enab04}"});
        oMenu1.addItem(oMItem4);

        //UI move Position
        var oMItem5 = new sap.m.MenuItem({key:"M05", icon:"sap-icon://outdent", text:"Move Position",enabled:"{/lcmenu/enab05}"});
        oMenu1.addItem(oMItem5);

        //copy 메뉴.
        var oMItem6 = new sap.m.MenuItem({key:"M06", icon:"sap-icon://copy", text:"Copy",enabled:"{/lcmenu/enab06}"});
        oMenu1.addItem(oMItem6);

        //paste 메뉴.
        var oMItem7 = new sap.m.MenuItem({key:"M07", icon:"sap-icon://paste", text:"Paste", enabled:"{/lcmenu/enab07}"});
        oMenu1.addItem(oMItem7);


        //생성한 popup 정보 return;
        return oPop;


    };  //디자인영역(미리보기)의 CONTEXT MENU 기능.



    
    //context menu popup 종료 처리.
    oAPP.fn.contextMenuClosePopup = function(oUi){
        //context menu 팝업이 open되어있으면.
        if(oUi.isOpen() === true){
            //popup 닫기.
            oUi.close();
        }

    };  //context menu popup 종료 처리.




    //메뉴 item선택건에 따른 기능 분기 처리.
    oAPP.fn.contextMenuItemPress = function(oEvent){
        
        //선택한 menu item의 KEY 정보 얻기.
        var l_key = oEvent.mParameters.item.getKey();

        switch(l_key){
            case "M01": //UI 추가 메뉴
                //UI 추가 처리.
                oAPP.fn.contextMenuInsertUI();
                break;
            
            case "M02": //UI 삭제 메뉴
                //UI 삭제 처리.
                oAPP.fn.contextMenuDeleteUI();
                break;
            
            case "M03": //UI up
                oAPP.fn.contextMenuUiMove("-");
                break;
            
            case "M04": //UI down
                oAPP.fn.contextMenuUiMove("+");
                break;
            
            case "M05": //UI move Position
                oAPP.fn.contextMenuUiMovePosition();
                break;
            
            case "M06": //copy 메뉴.
                break;

            case "M07": //paste 메뉴.
                break;                                                                                                        

        }

    };  //메뉴 item선택건에 따른 기능 분기 처리.




    //디자인영역 context menu 활성여부 설정.
    oAPP.fn.enableDesignContextMenu = function(OBJID){

        var ls_menu = {};

        //context menu의 TITLE 정보.
        ls_menu.title = OBJID;

        //context menu를 호출한 OBJID 정보.
        ls_menu.OBJID = OBJID;

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

        //context menu 정보 바인딩.
        oAPP.attr.oModel.setProperty('/lcmenu',ls_menu);

        //context menu를 호출한 UI 선택 처리.
        oAPP.fn.setSelectTreeItem(OBJID);

    };  //디자인영역 context menu 활성여부 설정.



    
    //UI 추가 메뉴 선택 처리.
    oAPP.fn.contextMenuInsertUI = function(){
      
        //UI 추가.
        function lf_setChild(a){
            
            //context menu 호출 UI의 child 정보가 존재하지 않는경우 생성.
            if(!ls_tree.zTREE){
                ls_tree.zTREE = [];
            }

            var l_cnt = parseInt(a.E_CRTCNT);

            //UI 반복 횟수만큼 그리기.
            for(var i=0; i<l_cnt; i++){

            //14번 저장 구조 생성.
            var l_14 = oAPP.fn.crtStru0014();

            //바인딩 처리 필드 생성.
            oAPP.fn.crtTreeBindField(l_14);


            l_14.APPID = oAPP.attr.appInfo.APPID;
            l_14.GUINR = oAPP.attr.appInfo.GUINR;

            //UI명 구성.
            l_14.OBJID = oAPP.fn.setOBJID(a.E_UIOBJ.UIOBJ);
            l_14.POBID = ls_tree.OBJID;
            l_14.UIOBK = a.E_UIOBJ.UIOBK;
            l_14.PUIOK = ls_tree.UIOBK;

            l_14.UIATK = a.E_EMB_AGGR.UIATK;
            l_14.UIATT = a.E_EMB_AGGR.UIATT;
            l_14.UIASN = a.E_EMB_AGGR.UIASN;
            l_14.UIATY = a.E_EMB_AGGR.UIATY;
            l_14.UIADT = a.E_EMB_AGGR.UIADT;
            l_14.UIADS = a.E_EMB_AGGR.UIADS;
            l_14.ISMLB = a.E_EMB_AGGR.ISMLB;

            l_14.UIFND = a.E_UIOBJ.UIFND;
            l_14.PUIATK = a.E_EMB_AGGR.UIATK;
            l_14.UILIB = a.E_UIOBJ.LIBNM;
            l_14.ISEXT = a.E_UIOBJ.ISEXT;
            l_14.TGLIB = a.E_UIOBJ.TGLIB;
            l_14.LIBNM = a.E_UIOBJ.LIBNM;

            //context menu 호출 라인의 child에 추가한 UI정보 수집.
            ls_tree.zTREE.push(l_14);

            var ls_0015 = oAPP.fn.crtStru0015();
            
            //embed aggregation 정보 구성.
            ls_0015.APPID = oAPP.attr.appInfo.APPID;
            ls_0015.GUINR = oAPP.attr.appInfo.GUINR;
            ls_0015.OBJID = l_14.OBJID;
            ls_0015.UIOBK = a.E_UIOBJ.UIOBK;
            ls_0015.UIATK = a.E_EMB_AGGR.UIATK;
            ls_0015.UILIK = a.E_UIOBJ.UILIK;
            ls_0015.UIATT = a.E_EMB_AGGR.UIATT;
            ls_0015.UIASN = a.E_EMB_AGGR.UIASN;
            ls_0015.UIADT = a.E_EMB_AGGR.UIADT;
            ls_0015.UIATY = "6";
            ls_0015.ISMLB = a.E_EMB_AGGR.ISMLB;
            ls_0015.ISEMB = "X";


            //미리보기 UI 추가
            oAPP.attr.ui.frame.contentWindow.addUIObjPreView(l_14.OBJID, l_14.UIOBK, l_14.LIBNM, l_14.UIFND, l_14.POBID, a.E_EMB_AGGR.UIATT);


            //UI 생성건 수집 처리.
            oAPP.attr.prev[l_14.OBJID]._T_0015 = [];
            oAPP.attr.prev[l_14.OBJID]._T_0015.push(ls_0015);

            ls_0015 = {};

            } //UI 반복 횟수만큼 그리기.
  
            //MODEL 갱신 처리.
            oAPP.attr.oModel.refresh();

            //design tree의 tree binding 정보 갱신 처리.
            var l_bind = oAPP.attr.ui.oLTree1.getBinding();
            l_bind._buildTree(0,oAPP.fn.designGetTreeItemCount());

            //메뉴 선택 tree 위치 펼침 처리.
            oAPP.fn.setSelectTreeItem(l_14.OBJID);

            //변경 FLAG 처리.
            oAPP.fn.setChangeFlag();

        } //UI 추가.
  
  


        //context menu를 호출한 라인의 OBJID 얻기.
        var l_OBJID = oAPP.attr.oModel.getProperty("/lcmenu/OBJID");

        //OBJID에 해당하는 TREE 정보 얻기.
        var ls_tree = oAPP.fn.getTreeData(l_OBJID);
        
        
        //UI추가 팝업 정보가 존재하는경우 팝업 호출.
        if(typeof oAPP.fn.callUIInsertPopup !== "undefined"){        
            oAPP.fn.callUIInsertPopup(ls_tree.UIOBK, lf_setChild);
            return;
        }
        
        //UI 추가 팝업 정보가 존재하지 않는다면 JS 호출 후 팝업 호출.
        oAPP.fn.getScript("design/js/insertUIPopop",function(){
            oAPP.fn.callUIInsertPopup(ls_tree.UIOBK, lf_setChild);
        });
  
    };  //UI 추가 메뉴 선택 처리.



    //contet menu UI삭제 메뉴 선택 이벤트.
    oAPP.fn.contextMenuDeleteUI = function(){  
  
        //선택라인의 삭제대상 OBJECT 제거 처리.
        function lf_deleteTreeLine(is_tree){
            
            //child정보가 존재하는경우.
            if(is_tree.zTREE.length !== 0){
                //하위 TREE 정보가 존재하는경우
                for(var i=0, l=is_tree.zTREE.length; i<l; i++){
                    //재귀호출 탐색하며 삭제 처리.
                    lf_deleteTreeLine(is_tree.zTREE[i]);

                }

            }

            //클라이언트 이벤트 및 sap.ui.core.HTML의 프로퍼티 입력건 제거 처리.
            oAPP.fn.delUIClientEvent(is_tree);

            //Description 삭제.
            oAPP.fn.deltDesc(is_tree.OBJID);

            //미리보기 UI 수집항목에서 해당 OBJID건 삭제.
            delete oAPP.attr.prev[is_tree.OBJID];

        } //선택라인의 삭제대상 OBJECT 제거 처리.
  
  
  
        //UI삭제전 확인 팝업 호출.
        parent.showMessage(sap, 30, "I", "선택한 라인을 삭제하시겠습니까?.",function(oEvent){
            
            //확인 팝업에서 YES를 선택한 경우 하위 로직 수행.
            if(oEvent !== "YES"){return;}
            
            //context menu를 호출한 라인의 OBJID 얻기.
            var l_OBJID = oAPP.attr.oModel.getProperty("/lcmenu/OBJID");

            //OBJID에 해당하는 TREE 정보 얻기.
            var ls_tree = oAPP.fn.getTreeData(l_OBJID);

            //미리보기 화면 UI 제거.
            oAPP.attr.ui.frame.contentWindow.delUIObjPreView(ls_tree.OBJID, ls_tree.POBID, ls_tree.UIATT, ls_tree.ISMLB);

            //삭제 이후 이전 선택처리 정보 얻기.
            var l_prev = oAPP.fn.designGetPreviousTreeItem(ls_tree.OBJID);

            //선택라인의 삭제대상 OBJECT 제거 처리.
            lf_deleteTreeLine(ls_tree);
            
            //부모 TREE 라인 정보 얻기.
            var ls_parent = oAPP.fn.getTreeData(ls_tree.POBID);
            
            //부모에서 현재 삭제대상 라인이 몇번째 라인인지 확인.
            var l_fIndx = ls_parent.zTREE.findIndex( a => a.OBJID === ls_tree.OBJID );

            if(l_fIndx !== -1){
                //부모에서 현재 삭제 대상건 제거.
                ls_parent.zTREE.splice(l_fIndx, 1);
            }
            
            //모델 갱신 처리.
            oAPP.attr.oModel.refresh(true);

            //삭제라인의 바로 윗 라인 선택 처리.
            oAPP.fn.setSelectTreeItem(l_prev);

            //변경 FLAG 처리.
            oAPP.fn.setChangeFlag();
  
        }); //UI삭제전 확인 팝업 호출.
  
  
    };  //contet menu UI삭제 메뉴 선택 이벤트.


    

    //ui 이동처리 function
    oAPP.fn.contextMenuUiMove = function(sign, pos){
        debugger;
        //context menu를 호출한 라인의 OBJID 얻기.
        var l_OBJID = oAPP.attr.oModel.getProperty("/lcmenu/OBJID");

        //OBJID에 해당하는 TREE 정보 얻기.
        var ls_tree = oAPP.fn.getTreeData(l_OBJID);
        
        //부모 TREE 정보 얻기.
        var l_parent = oAPP.fn.getTreeData(ls_tree.POBID);

        //현재 UI가 부모의 몇번째에 위치해있는지 확인.
        var l_pos = l_parent.zTREE.findIndex( a => a.OBJID === ls_tree.OBJID );

        //현재 이동하는 UI의 동일 AGGR건 얻기.
        var lt_filt = l_parent.zTREE.filter( a => a.UIATT === ls_tree.UIATT );
        
        //이동전 ui 위치 확인.
        var l_indx1 = lt_filt.findIndex( a => a.OBJID === ls_tree.OBJID );

        //현재 UI를 부모에서 제거 처리.
        l_parent.zTREE.splice(l_pos,1);
        
        //이전 위치로 이동하는경우.
        if(sign === "-"){
            //이전 위치를 position으로 설정.
            l_pos -= 1;            
            
        //다음 위치로 이동하는경우.
        }else if(sign === "+"){
            //다음 위치를 position으로 설정.
            l_pos +=1;
                        
        //대상 position으로 이동하는경우.
        }else if(typeof pos !== "undefined"){
            //입력된 position을 이동 위치로 설정.
            l_pos = pos;
  
        }

        //현재 UI를 대상 위치로 이동.
        l_parent.zTREE.splice(l_pos, 0, ls_tree);
        
        //모델 갱신 처리.
        oAPP.attr.oModel.refresh();
        
        //design tree의 tree binding 정보 갱신 처리.
        var l_bind = oAPP.attr.ui.oLTree1.getBinding();
        l_bind._buildTree(0,oAPP.fn.designGetTreeItemCount());
  
        var lt_filt = l_parent.zTREE.filter( a => a.UIATT === ls_tree.UIATT );
        
        //이동 후 ui 위치 확인.
        var l_indx2 = lt_filt.findIndex( a => a.OBJID === ls_tree.OBJID );
        
        //AGGREGATION상에서 위치가 변경된경우.
        if(l_indx1 !== l_indx2){
            //미리보기 갱신 처리.
            oAPP.attr.ui.frame.contentWindow.moveUIObjPreView(ls_tree.OBJID, ls_tree.POBID, ls_tree.UIATT,l_indx2);

            //미리보기 ui 선택.
            oAPP.attr.ui.frame.contentWindow.selPreviewUI(ls_tree.OBJID);

        }

        //design영역 tree item 선택 재선택 처리.
        oAPP.fn.setSelectTreeItem(ls_tree.OBJID);

        //변경 FLAG 처리.
        oAPP.fn.setChangeFlag();
 

    };  //ui 이동처리 function



    
    //UI 위치 이동 처리.
    oAPP.fn.contextMenuUiMovePosition = function(){

        //CALL BACK FUNCTION.
        function lf_callback(pos){
            //대상 위치로 UI 이동 처리.
            oAPP.fn.contextMenuUiMove(undefined, pos);

        }   //CALL BACK FUNCTION.

        //context menu를 호출한 라인의 OBJID 얻기.
        var l_OBJID = oAPP.attr.oModel.getProperty("/lcmenu/OBJID");

        //OBJID에 해당하는 TREE 정보 얻기.
        var ls_tree = oAPP.fn.getTreeData(l_OBJID);
        
        //부모 TREE 정보 얻기.
        var l_parent = oAPP.fn.getTreeData(ls_tree.POBID);

        //현재 UI가 부모의 몇번째에 위치해있는지 확인.
        var l_pos = l_parent.zTREE.findIndex( a => a.OBJID === ls_tree.OBJID ) + 1;
                
        
        //UI위치 이동 function이 존재하는경우 호출 처리.
        if(typeof oAPP.fn.uiMovePosition !== "undefined"){
            oAPP.fn.uiMovePosition(l_pos, l_parent.zTREE.length, lf_callback);
            return;

        }

        //UI위치 이동 function이 존재하지 않는경우 js 호출 후 function 호출.
        oAPP.fn.getScript("design/js/uiMovePosition",function(){
            oAPP.fn.uiMovePosition(l_pos, l_parent.zTREE.length, lf_callback);
        });

    };  //UI 위치 이동 처리.

})();