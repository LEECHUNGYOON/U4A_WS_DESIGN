(function(){
  //좌측 페이지(UI Design 영역) 구성.
  oAPP.fn.uiDesignArea = function(oLPage){

    var oModel = oLPage.getModel();

    //UI TABLE 라이브러리 LOAD.
    sap.ui.getCore().loadLibrary("sap.ui.table");

    //design tree UI.
    var oLTree1 = new sap.ui.table.TreeTable({selectionMode:"Single", selectionBehavior:"RowOnly",
      columnHeaderVisible:false, visibleRowCountMode:"Auto", alternateRowColors:true});
    oLPage.addContent(oLTree1);

    //tree item 선택 이벤트.
    oLTree1.attachCellClick(function(oEvent){

      //데이터 출력 라인을 선택하지 않은경우 exit.
      if(!oEvent.mParameters.rowBindingContext){return;}

      //선택 라인 정보 얻기.
      var ls_tree = oEvent.mParameters.rowBindingContext.getProperty();

      //라인선택에 따른 각 화면에 대한 처리.
      oAPP.fn.designTreeItemPress(ls_tree);

    }); //tree item 선택 이벤트.



    //tree instance 정보 광역화.
    oAPP.attr.ui.oLTree1 = oLTree1;

    //checkbox Column.
    var oLCol1 = new sap.ui.table.Column({autoResizable:true});
    oLTree1.addColumn(oLCol1);

    var oLHbox1 = new sap.m.HBox({width:"100%",alignItems:"Center", justifyContent:"SpaceBetween",wrap:"Wrap"});
    oLCol1.setTemplate(oLHbox1);

    var oLHbox2 = new sap.m.HBox({renderType:"Bare",alignItems:"Center"});
    oLHbox1.addItem(oLHbox2);

    //라인 선택 checkbox
    var oChk1 = new sap.m.CheckBox({visible:"{chk_visible}",selected:"{chk}"});
    oLHbox2.addItem(oChk1);

    //checkbox 선택 이벤트.
    oChk1.attachSelect(function(oEvent){

      //이벤트 발생 라인의 UI정보 얻기.
      var ls_tree = this.getBindingContext().getProperty();
      
      //design 영역의 체크박스 선택에 따른 
      oAPP.fn.designTreeSelChkbox(ls_tree);

    }); //checkbox 선택 이벤트.

    
    //UI명.
    var oLtxt1 = new sap.m.Text({text:"{OBJID}"});
    oLHbox2.addItem(oLtxt1);

    //부모 Aggregation
    var oLtxt2 = new sap.m.Text({text:"{UIATT}"});
    oLHbox1.addItem(oLtxt2);


    //drag UI 생성.
    var oLTDrag1 = new sap.ui.core.dnd.DragInfo({sourceAggregation:"rows"});
    oAPP.attr.ui.oLTree1.addDragDropConfig(oLTDrag1);

    //drop UI 생성.
    var oLTDrop1 = new sap.ui.core.dnd.DropInfo({targetAggregation:"rows"});
    oAPP.attr.ui.oLTree1.addDragDropConfig(oLTDrop1);


    //drag start 이벤트
    oLTDrag1.attachDragStart(function(oEvent){

      //drag한 위치의 바인딩 정보 얻기.
      var l_ctxt = oEvent.mParameters.target.getBindingContext();
      if(!l_ctxt){return;}

      //drag한 TREE 정보 얻기.
      var ls_drag = l_ctxt.getProperty();
      if(!ls_drag){return;}

      //DRAG한 UI ID 정보 세팅.
      event.dataTransfer.setData("text/plain", ls_drag.OBJID);

      //drag 시작시 drop 가능건에 대한 제어 처리.
      oAPP.fn.designTreeDragStart(ls_drag);


    }); //drag start 이벤트



    //drag 종료이벤트
    oLTDrag1.attachDragEnd(function(oEvent){

      //drag 종료 처리.
      oAPP.fn.designDragEnd();

    }); //drag 종료이벤트
    

    
    //drag UI가 다른라인에 올라갔을때 이벤트.
    oLTDrop1.attachDragEnter(function(oEvent){
      //drag UI가 다른라인에 올라갔을때 이벤트.
      oAPP.fn.designDragEnter(oEvent);

    });


    //drop 이벤트.
    oLTDrop1.attachDrop(function(oEvent){

      

      if(!oEvent.mParameters.droppedControl){return;}

      var l_drop = oModel.getProperty("",oEvent.mParameters.droppedControl.getBindingContext());

      //DROP 처리.
      oAPP.fn.UIDrop(oEvent, l_drop.OBJID);


    }); //drop 이벤트.



    //tree toolbar UI.
    var oLTBar1 = new sap.m.Toolbar();
    oLTree1.setToolbar(oLTBar1);

    //펼침 버튼.
    var oLBtn1 = new sap.m.Button({icon:"sap-icon://expand-group"});
    oLTBar1.addContent(oLBtn1);

    //펼침 이벤트.
    oLBtn1.attachPress(function(){

      //선택 라인의 하위 UI 펼침처리.
      oAPP.fn.expandTreeItem();

    }); //펼침 이벤트



    //접힘 버튼.
    var oLBtn2 = new sap.m.Button({icon:"sap-icon://collapse-group"});
    oLTBar1.addContent(oLBtn2);

    //접힘 버튼 선택 이벤트.
    oLBtn2.attachPress(function(){
      //선택한 라인을 접힘 처리.
      oAPP.attr.ui.oLTree1.collapse(oAPP.attr.ui.oLTree1.getSelectedIndex());

    }); //접힘 이벤트



    //구분자 추가.
    oLTBar1.addContent(new sap.m.ToolbarSeparator());

    //삭제 버튼.
    var oLBtn3 = new sap.m.Button({icon:"sap-icon://delete",visible:"{/IS_EDIT}"});
    oLTBar1.addContent(oLBtn3);

    //삭제버튼 선택 이벤트
    oLBtn3.attachPress(function(oEvent){

      //멀티 삭제 처리.
      oAPP.fn.designTreeMultiDeleteItem();

    });



    //context menu ui 변수.
    var oMenu;

    //context menu ui 생성 function이 존재하는경우.
    if(typeof oAPP.fn.callDesignContextMenu !== "undefined"){
      //context menu ui 생성 처리.
      oMenu = oAPP.fn.callDesignContextMenu.call(this);
    }else{
      //context menu ui 생성 function이 존재하지 않는경우 script 호출.
      oAPP.fn.getScript("design/js/callDesignContextMenu",function(){
        //context menu ui 생성 처리.
        oMenu = oAPP.fn.callDesignContextMenu.call(this);
      });

    }

    
    
    //context menu 호출 이벤트.
    oLTree1.attachBrowserEvent('contextmenu', function(oEvent){

      var l_ui = oAPP.fn.getUiInstanceDOM(oEvent.target, sap.ui.getCore());
      if(!l_ui){return;}

      //해당 라인의 바인딩 정보 얻기.
      var l_ctxt = l_ui.getBindingContext();
      if(!l_ctxt){return;}

      //tree 정보 얻기.
      var ls_tree = l_ctxt.getProperty();
      if(!ls_tree){return;}

      //context menu 호출전 메뉴 선택 가능 여부 설정.
      oAPP.fn.enableDesignContextMenu(oMenu, ls_tree.OBJID);

      //메뉴 호출 처리.
      oMenu.openBy(oEvent.target);

    }); //context menu 호출 이벤트.

    
    
    //design tree 스크롤 이벤트.
    oLTree1.attachFirstVisibleRowChanged(function(){
      
      //context menu가 open되어있다면 close 처리.
      oAPP.fn.contextMenuClosePopup(oMenu);

      //drop 가능 여부에 따른 라인 css 처리.
      oAPP.fn.designSetDropStyle();

    }); //design tree 스크롤 이벤트.


    oLTree1.bindAggregation("rows",{path:"/zTREE",template:new sap.ui.table.Row(),parameters:{arrayNames:["zTREE"]}});


  };



  //drag 종료 처리.
  oAPP.fn.designDragEnd = function(){

    //tree drag & drop 가능여부 처리.
    oAPP.fn.setTreeDnDEnable(oAPP.attr.oModel.oData.zTREE[0]);
    oAPP.attr.oModel.refresh();

    var lt_item = oAPP.attr.ui.oLTree1.getRows();

    delete oAPP.attr.ui.oLTree1.__isdragStarted;

    for(var i=0, l=lt_item.length; i<l;i++){
      //drag 종료시 drop 불가능 css 제거 처리.
      lt_item[i].removeStyleClass("disableTreeDrop");
    }

  };  //drag 종료 처리.

  
  //visible, editable등의 tree 처리 전용 바인딩 필드 생성 처리.
  oAPP.fn.crtTreeBindField = function(is_0014){

    is_0014.drag_enable = true;  //tree item drag 가능여부 필드
    is_0014.drop_enable = oAPP.attr.oModel.oData.IS_EDIT;  //tree item drop 가능여부 필드

    is_0014.chk_visible = oAPP.attr.oModel.oData.IS_EDIT;  //chkbox 활성여부 필드.

    is_0014.chk = false; //chkbox checked 바인딩 필드.

    if(typeof is_0014.zTREE === "undefined"){
      is_0014.zTREE = []; //하위 TREE 정보
    }

  };  //visible, editable등의 tree 처리 전용 바인딩 필드 생성 처리.




  //체크박스 활성여부 처리.
  oAPP.fn.setTreeChkBoxEnable = function(is_tree){

    //default checkbox 비활성 처리.
    is_tree.chk_visible = false;


    //편집 모드인경우 checkbox 활성 처리.
    if(oAPP.attr.appInfo.IS_EDIT === "X"){
      is_tree.chk_visible = true;
    }

    //root, APP는 체크박스 비활성 처리.
    if(is_tree.OBJID === "ROOT" || is_tree.OBJID === "APP"){
      is_tree.chk_visible = false;

    }

    //하위 UI가 존재하지 않는경우 exit.
    if(!is_tree.zTREE || is_tree.zTREE.length === 0){return;}

    //하위 UI가 존재하는경우 재귀호출을 통해 checkbox 활성여부 처리.
    for(var i=0, l=is_tree.zTREE.length; i<l; i++){
      oAPP.fn.setTreeChkBoxEnable(is_tree.zTREE[i]);
    }

  };



  //tree drag & drop 가능여부 처리.
  oAPP.fn.setTreeDnDEnable = function(is_tree){

    //drag는 default 가능처리(display 상태일때도, runtime class navigator 기능 때문)
    is_tree.drag_enable = true;

    //drop는 현재 편집 가능상태일때만 drop 가능 처리.
    is_tree.drop_enable = oAPP.attr.oModel.oData.IS_EDIT;

    //root는 drag & drop 불가.
    if(is_tree.OBJID === "ROOT"){
      is_tree.drag_enable = false;
      is_tree.drop_enable = false;

    }

    //하위 UI가 존재하지 않는경우 exit.
    if(!is_tree.zTREE || is_tree.zTREE.length === 0){return;}

    //하위 UI가 존재하는경우 재귀호출을 통해 drag & drop 가능여부 처리.
    for(var i=0, l=is_tree.zTREE.length; i<l; i++){
      oAPP.fn.setTreeDnDEnable(is_tree.zTREE[i]);
    }

  };  //tree drag & drop 가능여부 처리.



  
  //tree 정보에서 UI명에 해당하는건 검색.
  oAPP.fn.getTreeData = function(OBJID, is_tree){
    //최초 호출상태인경우.
    if(typeof is_tree === "undefined"){
      //ROOT를 매핑.
      is_tree = oAPP.attr.oModel.oData.zTREE[0];
    }

    //현재 TREE가 검색대상건인경우 해당 TREE정보 RETURN.
    if(is_tree.OBJID === OBJID){
      return is_tree;
    }

    //child가 존재하지 않는경우 exit.
    if(!is_tree.zTREE || is_tree.zTREE.length === 0){return;}

    //현재 TREE가 검색대상이 아닌경우 CHILD를 탐색하며 OBJID에 해당하는 TREE정보 검색.
    for(var i=0, l=is_tree.zTREE.length; i<l; i++){
      
      var ls_tree = oAPP.fn.getTreeData(OBJID, is_tree.zTREE[i]);
      if(typeof ls_tree  !== "undefined"){
        return ls_tree;
      }

    }    

  };  //tree 정보에서 UI명에 해당하는건 검색.




  //입력 OBJID가 부모의 몇번째 INDEX인지 확인.
  oAPP.fn.getTreeIndexOfChild = function(OBJID){

    //child를 탐색하며 OBJID의 위치 정보 확인.
    function lf_findItem(it_tree){

      //TREE에 값이 없는경우 EXIT.
      if(it_tree.length === 0){return;}

      //TREE 정보중 입력 OBJID건 존재여부 확인.
      for(var i=0, l=it_tree.length; i<l; i++){

        //현재 정보가 입력 OBJID와 동일한경우.
        if(it_tree[i].OBJID === OBJID){
          //해당 INDEX 정보 RETURN.
          return i;
        }

        //재귀호출을 통해 입력 OBJID에 해당하는 INDEX 정보 검색.
        var l_index = lf_findItem(it_tree[i].zTREE);

        //INDEX 정보를 찾은경우 RETURN.
        if(typeof l_index !== "undefined"){return l_index;}

      }

    } //child를 탐색하며 OBJID의 위치 정보 확인.


    //TREE를 탐색하며 입력 OJBID의 INDEX 정보 찾기.
    return lf_findItem(oAPP.attr.oModel.oData.zTREE);


  };  //입력 OBJID가 부모의 몇번째 INDEX인지 확인.



  //tree item 펼침 처리.
  oAPP.fn.expandTreeItem = function(){

    //선택한 라인을 기준으로 하위를 탐색하며 펼침 처리.
    function lf_expand(){

      //처리대상 라인의 node 정보 얻기.
      var l_node = l_bind.getNodeByIndex(l_indx);

      //node를 찾지 못한 경우 exit(모든 node 탐색).
      if(typeof l_node === "undefined"){return;}

      //선택한 라인에서 파생된건이 아닌경우 exit.
      if(l_group !== l_node.groupID.substr(0,l_group.length)){return;}
      
      //현재 node의 child가 존재, 해당 node가 펼쳐져있지 않다면.
      if(l_node.isLeaf === false && l_node.nodeState.expanded === false){
        //해당위치 펼침 처리.
        oAPP.attr.ui.oLTree1.expand(l_indx);

      }

      //다음 라인 정보 구성.
      l_indx += 1;

      //하위를 탐색하며 tree 펼첨 처리.
      lf_expand();
      
    } //선택한 라인을 기준으로 하위를 탐색하며 펼침 처리.


    //선택한 라인 index 얻기.
    var l_indx = oAPP.attr.ui.oLTree1.getSelectedIndex();

    //선택한 라인이 없는경우 exit.
    if(l_indx === -1){return;}

    //tree 바인딩 정보 얻기.
    var l_bind = oAPP.attr.ui.oLTree1.getBinding();

    //선택한 라인의 바인딩 정보 얻기.
    var l_group = l_bind.getNodeByIndex(l_indx).groupID;

    //선택한 라인을 기준으로 하위를 탐색하며 펼침 처리.
    lf_expand();


  };  //tree item 펼침 처리.




  //삭제 대상 UI의 클라이언트 이벤트 및 sap.ui.core.HTML의 content 수집 정보 삭제 처리.
  oAPP.fn.delUiClientEvent = function(is_tree){

    //클라이언트 이벤트가 존재하지 않는경우 exit.
    if(oAPP.DATA.APPDATA.T_CEVT.length === 0){return;}

    //프로퍼티 설정건이 존재하지 않는경우 EXIT.
    if(oAPP.attr.prev[is_tree.OBJID]._T_0015.length === 0){return;}


    //sap.ui.core.HTML UI인경우.
    if(is_tree.UIFND === "SAP.UI.CORE.HTML"){
      //content 프로퍼티에 직접 입력한 내용이 존재하는지 확인.
      var l_findx = oAPP.DATA.APPDATA.T_CEVT.findIndex( a => a.OBJID === is_tree.OBJID + "CONTENT" && a.OBJTY === "HM");

      if(l_findx !== -1){
        //해당 HTML 삭제 처리.
        oAPP.DATA.APPDATA.T_CEVT.splice(l_findx, 1);
      }

    }

    //이벤트 설정건 존재여부 확인.
    var lt_evt = oAPP.attr.prev[is_tree.OBJID]._T_0015.filter( a => a.UIATY === "2" );

    //이벤트 설정건이 없는경우 exit.
    if(lt_evt.length === 0){return;}

    for(var i=0, l=lt_evt.length; i<l; i++){

      //클라이언트 이벤트 설정건 존재여부 확인.
      var l_findx = oAPP.DATA.APPDATA.T_CEVT.findIndex( a => a.OBJID === is_tree.OBJID + lt_evt[i].UIASN && a.OBJTY === "JS");

      //설정건이 없는경우 continue
      if(l_findx === -1){continue;}

      //클라이언트 이벤트가 존재하는경우 해당 이벤트 삭제 처리.
      oAPP.DATA.APPDATA.T_CEVT.splice(l_findx, 1);

    }

  };  //삭제 대상 UI의 클라이언트 이벤트 및 sap.ui.core.HTML의 content 수집 정보 삭제 처리.




  //대상 UI의 클라이언트 이벤트 존재건 검색.
  oAPP.fn.getUiClientEvent = function(is_tree){

    //클라이언트 이벤트가 존재하지 않는경우 exit.
    if(oAPP.DATA.APPDATA.T_CEVT.length === 0){return;}

    var lt_CEVT = [];

    //sap.ui.core.HTML UI인경우.
    if(is_tree.UIFND === "SAP.UI.CORE.HTML"){
      //content 프로퍼티에 직접 입력한 내용이 존재하는지 확인.
      var l_findx = oAPP.DATA.APPDATA.T_CEVT.findIndex( a => a.OBJID === is_tree.OBJID + "CONTENT" && a.OBJTY === "HM");

      if(l_findx !== -1){
        //해당 HTML 수집 처리.
        lt_CEVT.push(oAPP.DATA.APPDATA.T_CEVT[l_findx]);
      }

    }

    //이벤트 설정건 존재여부 확인.
    var lt_evt = oAPP.attr.prev[is_tree.OBJID]._T_0015.filter( a => a.UIATY === "2" );

    //이벤트 설정건이 없는경우 exit.
    if(lt_evt.length === 0){
      return lt_CEVT.length === 0 ? undefined : lt_CEVT;
    }


    for(var i=0, l=lt_evt.length; i<l; i++){

      //클라이언트 이벤트 설정건 존재여부 확인.
      var l_findx = oAPP.DATA.APPDATA.T_CEVT.findIndex( a => a.OBJID === is_tree.OBJID + lt_evt[i].UIASN && a.OBJTY === "JS");

      //설정건이 없는경우 continue
      if(l_findx === -1){continue;}

      //클라이언트 이벤트가 존재하는경우 해당 이벤트 삭제 처리.
      lt_CEVT.push(oAPP.DATA.APPDATA.T_CEVT[l_findx]);

    }

    return lt_CEVT.length === 0 ? undefined : lt_CEVT;


  };  //대상 UI의 클라이언트 이벤트 존재건 검색.




  //클라이언트 이벤트, HTML정보 복사 처리.
  oAPP.fn.copyUiClientEvent = function(OBJID, is_tree){

    //클라이언트 이벤트, HTML정보가 한건도 없는경우 exit.
    if(oAPP.DATA.APPDATA.T_CEVT.length === 0){return;}

    //원본 UI의 HTML정보, 클라이언트 이벤트 존재여부 확인.
    var lt_event = oAPP.attr.prev[OBJID]._T_0015.filter( a=> a.ADDSC !== "");

    //원본 UI의 HTML정보, 클라이언트 이벤트가 없는경우 exit.
    if(lt_event.length === 0){return;}

    var ls_copy = {},
        l_objid = "";

    //원본 UI의 HTML정보, 클라이언트 이벤트 기준으로 복사처리.
    for(var i=0, l=lt_event.length; i<l; i++){

      //HTML정보, 클라이언트 이벤트 정보 검색.
      var ls_cevt = oAPP.DATA.APPDATA.T_CEVT.find( a=> a.OBJID === lt_event[i].OBJID + lt_event[i].UIASN );

      //HTML정보, 클라이언트 이벤트 정보가 없는경우 skip.
      if(typeof ls_cevt === "undefined"){continue;}

      //복사할 UI명 + attribute 대문자명.
      ls_copy.OBJID = is_tree.OBJID + lt_event[i].UIASN;

      //유형(HM:HTML, CS:CSS, JS:javascript)
      ls_copy.OBJTY = ls_cevt.OBJTY;

      //HTML정보, 클라이언트 이벤트 SCRIPT.
      ls_copy.DATA = ls_cevt.DATA;

      oAPP.DATA.APPDATA.T_CEVT.push(ls_copy);
      ls_copy = {};

    }


  };  //클라이언트 이벤트, HTML정보 복사 처리.




  //tree item 선택 처리
  oAPP.fn.setSelectTreeItem = function(OBJID, UIATK){
    
    //tree를 탐색하며 ROOT로부터 입력 OBJID 까지의 PATH 정보 구성
    function lf_getTreePath(it_tree){

      //tree 정보가 존재하지 않는경우 exit.
      if(jQuery.isArray(it_tree) !== true || it_tree.length === 0){
        return;
      }

      //tree 정보를 탐색하며 입력 OBJID와 동일건 검색.
      for(var i=0, l=it_tree.length, l_find; i<l; i++){

        //검색대상 OBJID에 해당하는경우 찾음 FLAG return.
        if(it_tree[i].OBJID === OBJID){
          //PATH를 수집.
          lt_path.unshift(it_tree[i].OBJID);
          return true;
        }

        //하위를 탐색하며 검색대상 OBJID에 해당하는건 검색.
        l_find = lf_getTreePath(it_tree[i].zTREE);

        //OBJID에 해당하는건을 찾은경우.
        if(l_find === true){
          //PATH를 수집.
          lt_path.unshift(it_tree[i].OBJID);
          return true;
        }
      }

    } //tree를 탐색하며 ROOT로부터 입력 OBJID 까지의 PATH 정보 구성

    

    //수집된 경로를 기준으로 child 정보 새로 검색.
    function lf_getNode(){

      //tree bind정보 새로 검색.
      var oBind = oAPP.attr.ui.oLTree1.getBinding();

      //start 경로 매핑.
      var lt_child = oBind._oRootNode;

      //수집된 경로를 기준으로 child를 다시 검색.
      for(var i=0, l=lt_route.length; i<l; i++){
        lt_child = lt_child.children[lt_route[i]];
      }

      //검색된 child return.
      return lt_child;

    } //수집된 경로를 기준으로 child 정보 새로 검색.

    

    //수집된 path를 기준으로 child를 탐색하며 펼침 처리.
    function lf_expand(is_child){

      //펼침 처리 대상 child의 OBJID 정보 검색.
      var l_objid = is_child.context.getProperty("OBJID");

      if(typeof l_objid === "undefined"){return;}
      
      //현재 CHILD가 펼침 처리 대상건인경우.
      if(l_objid === lt_path[0]){
        
        //입력UI와 동일건인경우. 선택 처리.
        if(OBJID === lt_path[0]){
          
          oAPP.attr.ui.oLTree1.setSelectedIndex(l_cnt);
          oAPP.fn.designTreeItemPress(is_child.context.getProperty(),l_cnt);

          //attribute 영역 선택처리(UIATK가 입력된경우 선택처리)
          oAPP.fn.setAttrFocus(UIATK);
          
        }
        
        //수집건에서 삭제.
        lt_path.splice(0,1);
        
        if(lt_path.length === 0){
          return;
        }

        //해당 라인이 펼쳐져 있지 않다면.
        if(is_child.isLeaf === false && is_child.nodeState.expanded === false){          
          //TREE 펼첨 처리.
          oAPP.attr.ui.oLTree1.expand(l_cnt);
        }


        //현재 탐색중인 child의 경로 정보 수집.
        lt_route.push(is_child.positionInParent);

        //수집된 경로를 기준으로 child 정보 새로 검색.
        is_child = lf_getNode();        

      }

      //expand 위치를 위한 counting.
      l_cnt += 1;

      //새로 검색된 child를 기준으로 하위를 탐색하며 expand 처리.
      for(var i=0, l=is_child.children.length; i<l; i++){
        lf_expand(is_child.children[i]);

        if(lt_path.length === 0){
          return;
        }

      }

    } //수집된 path를 기준으로 child를 탐색하며 펼침 처리.

    //OBJID가 존재하지 않는경우 EXIT.
    if(typeof OBJID === "undefined" || OBJID === null || OBJID === ""){return;}

    var lt_route = [], lt_path = [], l_cnt = 0;

    //입력 UI명으로 부터 부모까지의 PATH 정보 검색.
    lf_getTreePath(oAPP.attr.oModel.oData.zTREE);

    //path 정보를 수집하지 않은경우 exit.
    if(lt_path.length === 0){return;}

    var l_bind = oAPP.attr.ui.oLTree1.getBinding();
        
    //수집한 path를 기준으로 tree 펼첨 처리.
    lf_expand(l_bind._oRootNode.children[0]);


  };  //tree item 선택 처리




  //생성한 UI명 채번
  oAPP.fn.setOBJID = function(objid){

    var l_cnt = 1;
      var l_upper = objid.toUpperCase();
      var l_objid = l_upper + l_cnt;

      var l_found = false, l_stru;

      //design tree 정보를 ITAB 형식으로 변환.
      var lt_0014 = oAPP.fn.parseTree2Tab(oAPP.attr.oModel.oData.zTREE);

      while(l_found !== true){

        //구성한 objid와 동일건 존재여부 확인.
        l_indx = lt_0014.findIndex( a => a.OBJID === l_objid );
        if(l_indx === -1){
          l_found = true;
          return l_objid;
        }

        l_cnt += 1;
        l_objid = l_upper + l_cnt;

      }

  };  //생성한 UI명 채번



  //drop callback 이벤트.
  oAPP.fn.drop_cb = function(param, i_drag, i_drop){

    //선택가능 aggregation리스트가 존재하지 않는경우, drag, drop의 부모, aggregation이 동일한경우.
    if(typeof param === "undefined" && i_drag.POBID === i_drop.POBID && i_drag.UIATK === i_drop.UIATK){
      //drag UI와 dropUI의 위치를 변경 처리함.

      //drop 위치의 부모 정보 검색.
      var l_parent = oAPP.fn.getTreeData(i_drop.POBID);

      //drag UI의 index 얻기.
      var l_dragIndex = l_parent.zTREE.findIndex( a=> a.OBJID === i_drag.OBJID);

      //drop UI의 index 얻기.
      var l_dropIndex = l_parent.zTREE.findIndex( a=> a.OBJID === i_drop.OBJID);

      //drag index가 drop index보다 큰경우.
      if(l_dragIndex > l_dropIndex){

        //부모에서 drag 위치 삭제.
        l_parent.zTREE.splice(l_dragIndex,1);

        //부모에서 drop 위치 삭제.
        l_parent.zTREE.splice(l_dropIndex,1);          

        //drag건을 drop위치에 추가.
        l_parent.zTREE.splice(l_dropIndex,0,i_drag);

        //drop건을 drag위치에 추가.
        l_parent.zTREE.splice(l_dragIndex,0,i_drop);

        //drag건 미리보기 위치이동.
        oAPP.attr.ui.frame.contentWindow.moveUIObjPreView(i_drag.OBJID, i_drag.POBID, i_drag.UIATT,l_dropIndex);

        //drop건 미리보기 위치이동.
        oAPP.attr.ui.frame.contentWindow.moveUIObjPreView(i_drop.OBJID, i_drop.POBID, i_drop.UIATT,l_dragIndex);

        //drop index가 drag index보다 큰경우.
      }else{
        
        //부모에서 drop 위치 삭제.
        l_parent.zTREE.splice(l_dropIndex,1);
          
        //부모에서 drag 위치 삭제.
        l_parent.zTREE.splice(l_dragIndex,1);
        
        //drop건을 drag위치에 추가.
        l_parent.zTREE.splice(l_dragIndex,0,i_drop);

        //drag건을 drop위치에 추가.
        l_parent.zTREE.splice(l_dropIndex,0,i_drag);

        //drop건 미리보기 위치이동.
        oAPP.attr.ui.frame.contentWindow.moveUIObjPreView(i_drop.OBJID, i_drop.POBID, i_drop.UIATT,l_dragIndex);

        //drag건 미리보기 위치이동.
        oAPP.attr.ui.frame.contentWindow.moveUIObjPreView(i_drag.OBJID, i_drag.POBID, i_drag.UIATT,l_dropIndex);

      }      

      //MODEL 갱신 처리.
      oAPP.attr.oModel.refresh();

      //design tree의 tree binding 정보 갱신 처리.
      var l_bind = oAPP.attr.ui.oLTree1.getBinding();
      l_bind._buildTree(0,oAPP.fn.designGetTreeItemCount());

      //drag한 UI 선택 처리.
      oAPP.fn.setSelectTreeItem(i_drag.OBJID);
      
      //drag 종료 처리.
      oAPP.fn.designDragEnd();

      //변경 FLAG 처리.
      oAPP.fn.setChangeFlag();
      
      return;

    } //선택가능 aggregation리스트가 존재하지 않는경우, drag, drop의 부모, aggregation이 동일한경우.


    //drag UI의 부모 UI 정보 검색.
    var l_parent = oAPP.fn.getTreeData(i_drag.POBID);

    //drag UI의 부모 UI를 찾지 못한 경우 EXIT.
    if(typeof l_parent === "undefined"){return;}

    //DRAG한 UI의 부모에서 DRAG UI의 INDEX 얻기.
    var l_indx = l_parent.zTREE.findIndex( a=> a.OBJID === i_drag.OBJID);

    //INDEX정보를 찾지 못한 경우 EXIT.
    if(l_indx === -1){return;}

    //DRAG UI의 부모에서 DRAG UI정보 제거.
    l_parent.zTREE.splice(l_indx, 1);

    if(typeof i_drop.zTREE === "undefined"){
      i_drop.zTREE = [];
    }

    //drop의 CHILD 영역에 DRAG UI를 추가.
    i_drop.zTREE.push(i_drag);

    //DRAG UI의 부모정보 변경.
    i_drag.POBID = i_drop.OBJID;
    i_drag.PUIOK = i_drop.UIOBK;

    //DRAG UI의 부모 AGGREGATION정보 변경.
    i_drag.UIATK = param.UIATK;
    i_drag.UIATT = param.UIATT;
    i_drag.UIASN = param.UIASN;
    i_drag.UIATY = param.UIATY;
    i_drag.UIADT = param.UIADT;
    i_drag.UIADS = param.UIADS;
    i_drag.ISMLB = param.ISMLB;
    i_drag.PUIATK = param.UIATK;

    //DRAG UI에서 EMBEDDED AGGREGATION 정보 찾기.
    var ls_embed = oAPP.attr.prev[i_drag.OBJID]._T_0015.find( a=> a.UIATY === "6");

    //drop UI의 aggregation 정보 매핑.
    oAPP.fn.moveCorresponding(param, ls_embed);
    ls_embed.UIATY = "6";

    //MODEL 갱신 처리.
    oAPP.attr.oModel.refresh();

    //design tree의 tree binding 정보 갱신 처리.
    var l_bind = oAPP.attr.ui.oLTree1.getBinding();
    l_bind._buildTree(0,oAPP.fn.designGetTreeItemCount());

    //동일 AGGREGATION에 추가된 UI 갯수 얻기.
    var l_indx = i_drop.zTREE.filter( a => a.UIATT === i_drag.UIATT );

    //미리보기 갱신 처리.
    oAPP.attr.ui.frame.contentWindow.moveUIObjPreView(i_drag.OBJID, i_drag.POBID, i_drag.UIATT, l_indx, i_drag.ISMLB);

    //drag한 UI 선택 처리.
    oAPP.fn.setSelectTreeItem(i_drag.OBJID);

    //drag 종료 처리.
    oAPP.fn.designDragEnd();

    //변경 FLAG 처리.
    oAPP.fn.setChangeFlag();

  }; //drop callback 이벤트.




  //UI design tree 라인 선택 이벤트.
  oAPP.fn.designTreeItemPress = function(is_tree, iIndex){
    /*
    //동일한 라인을 선택한 경우 exit.
    if(oAPP.attr.oModel.oData.uiinfo && oAPP.attr.oModel.oData.uiinfo.OBJID === is_tree.OBJID){
      return;
    }*/

    //UI Info 영역 갱신 처리.
    oAPP.fn.setUIInfo(is_tree);


    //선택한 ui에 해당하는 attr로 갱신 처리.
    oAPP.fn.updateAttrList(is_tree.UIOBK, is_tree.OBJID);


    //미리보기 화면 갱신 처리.
    oAPP.attr.ui.frame.contentWindow.refreshPreview(is_tree);


    //팝업 호출건 강제 종료 처리.
    oAPP.attr.ui.frame.contentWindow.closePopup();


    //미리보기 ui 선택 처리
    oAPP.attr.ui.frame.contentWindow.selPreviewUI(is_tree.OBJID);

    //tree의 first visible row 변경이 필요한경우 하위 로직 수행.
    if(typeof iIndex === "undefined"){return;}

    var lt_ctxt = oAPP.attr.ui.oLTree1._getRowContexts();

    if(lt_ctxt.length === 0){
      //해당 아이템으로 focus 처리.
      oAPP.attr.ui.oLTree1.setFirstVisibleRow(iIndex);
      return;
    }

    //tree에서 first visible row 이동 여부 확인.
    for(var i=0, l=lt_ctxt.length; i<l; i++){
      if(!lt_ctxt[i].context){continue;}

      //현재 보여지고 있는 tree에 이동대상 OBJID가 존재하는경우 이동 불필요 EXIT 처리.
      if(lt_ctxt[i].context.getProperty("OBJID") === is_tree.OBJID){return;}
    }    

    //해당 아이템으로 focus 처리.
    oAPP.attr.ui.oLTree1.setFirstVisibleRow(iIndex);


  };  //UI design tree 라인 선택 이벤트.




  //design tree의 checkbox 선택 이벤트.
  oAPP.fn.designTreeSelChkbox = function(is_tree){

    //현재 UI의 하위를 전부 체크선택, 체크해제 처리
    function lf_setCheckAllChild(is_tree, bChecked){

      //현재 라인의 체크박스 선택/해제 처리.
      is_tree.chk = bChecked;

      //child 정보가 없는경우 exit.
      if(!is_tree.zTREE || is_tree.zTREE.length === 0){return;}

      //child정보가 있는경우 하위를 탐색하며 체크박스 선택/해제 처리.
      for(var i=0, l=is_tree.zTREE.length; i<l; i++){
        lf_setCheckAllChild(is_tree.zTREE[i], bChecked);
      }

    } //현재 UI의 하위를 전부 체크선택, 체크해제 처리



    //현재 UI의 부모를 탐색하면서 체크박스 해제 처리.
    function lf_setCheckParent(oNode){
      //NODE 정보가 존재하지 않는경우 EXIT.
      if(typeof oNode === "undefined" || oNode === null || 
        typeof oNode.context === "undefined" ||
        oNode.context === null){
          return;
      }

      //찾은 부모의 체크박스 해제 처리.
      oAPP.attr.oModel.setProperty("chk", false, oNode.context);

      //부모를 탐색하면서 체크 해제 처리.
      lf_setCheckParent(oNode.parent);

    } //현재 UI의 부모를 탐색하면서 체크박스 해제 처리.

    

    //이벤트 발생 라인부터 하위를 탐색하며 체크박스 선택/해제 처리.
    lf_setCheckAllChild(is_tree, is_tree.chk);

    //선택해제건이 아닌경우 exit.
    if(is_tree.chk !== false){
      //화면 갱신 처리.
      oAPP.attr.oModel.refresh();
      return;

    }

    //현재 이벤트가 발생한 라인의 체크박스가 해제된경우.
    
    //TREE의 바인딩 정보 얻기.
    var l_bind = oAPP.attr.ui.oLTree1.getBinding();

    //바인딩 정보를 얻지 못한 경우 EXIT.
    if(typeof l_bind === "undefined" || 
      Array.isArray(l_bind._aRowIndexMap) !== true || 
      l_bind._aRowIndexMap.length === 0){
        return;
    }


    for(var i=0, l_OBJID, l=l_bind._aRowIndexMap.length; i<l; i++){
      
      //CONTEXT 정보가 없으면 SKIP.
      if(typeof l_bind._aRowIndexMap[i] === "undefined" || l_bind._aRowIndexMap[i].context === null){continue;}

      //해당 라인의 OBJID 정보 얻기.
      l_OBJID = l_bind._aRowIndexMap[i].context.getProperty("OBJID");
      
      //체크박스 선택 라인의 OBJID와 다른경우 SKIP.
      if(l_OBJID !== is_tree.OBJID){continue;}

      //체크박스 선택 라인위치를 찾은경우 부모를 탐색하며 체크박스 해제 처리.
      lf_setCheckParent(l_bind._aRowIndexMap[i]);

      break;

    }

  };  //design tree의 checkbox 선택 이벤트.




  //drop 가능여부 처리.
  oAPP.fn.setDropEnable = function(is_tree){

    //design tree영역의 drop 가능여부 판단 내부 function.
    function lf_setDropEnable(is_child, it_0027, bChild){
      
      //default drop 불가능 처리.
      is_child.drop_enable = false;

      //drag한 UI의 child인경우.
      if(bChild === true){
        if(is_child.zTREE.length === 0){return;}

        //child UI 존재시 하위를 탐색하며 drop 불가 처리.
        for(var i=0, l=is_child.zTREE.length; i<l; i++){
          lf_setDropEnable(is_child.zTREE[i], it_0027, bChild);
        }

        return;

      }

      //현재 탐색하고 있는 UI가 drag한 UI인경우.
      if(is_child.OBJID === is_tree.OBJID){

        if(is_child.zTREE.length === 0){return;}

        //child UI 존재시 하위를 탐색하며 drop 불가 처리.
        for(var i=0, l=is_child.zTREE.length; i<l; i++){
          lf_setDropEnable(is_child.zTREE[i], it_0027, true);
        }

        return;

      }


      //점검대상 라인의 입력가능한 aggregation정보 얻기.
      var lt_0023 = oAPP.DATA.LIB.T_0023.filter( a => a.UIOBK === is_child.UIOBK && a.UIATY === "3" && a.ISDEP !== "X" );

      if(lt_0023.length !== 0){

        for(var i=0, l=lt_0023.length; i<l; i++){
          //점검대상 라인의 aggregation의 UIOBK정보 얻기.
          var ls_0022 = oAPP.DATA.LIB.T_0022.find( a=> a.LIBNM === lt_0023[i].UIADT );
          if(!ls_0022){continue;}

          //drag UI가 drop 가능한 UI인지 확인.
          //var ls_0027 = oAPP.DATA.LIB.T_0027.find( a => a.TGOBJ === ls_0022.UIOBK && a.SGOBJ === is_tree.UIOBK );
          var ls_0027 = it_0027.find( a => a.SGOBJ === ls_0022.UIOBK );

          //drop불가능한 UI인경우 다음 aggrgation의 drop여부 확인.
          if(!ls_0027){continue;}

          //drag한 UI가 drop 가능한 라인인경우 drop 가능 flag 처리. 
          is_child.drop_enable = true;
          break;

        }

      }

      if(is_child.zTREE.length === 0){return;}

      for(var i=0, l=is_child.zTREE.length; i<l; i++){
        lf_setDropEnable(is_child.zTREE[i], it_0027, bChild);
      }


    } //design tree영역의 drop 가능여부 판단 내부 function.

    //화면 편집상태가 아닌경우 exit.
    if(oAPP.attr.oModel.oData.IS_EDIT !== true){return;}

    var lt_0027 = oAPP.DATA.LIB.T_0027.filter( a => a.TGOBJ === is_tree.UIOBK );

    //drag한 UI를 기준으로 tree의 drop가능한 라인 여부 판단.
    lf_setDropEnable(oAPP.attr.oModel.oData.zTREE[0], lt_0027);


  };  //drop 가능여부 처리.



  //drop 가능여부 style 처리.
  oAPP.fn.designSetDropStyle = function(){

    //drag가 시작되지 않은경우 exit.
    if(!oAPP.attr.ui.oLTree1.__isdragStarted){return;};

    var lt_row = oAPP.attr.ui.oLTree1.getRows();
    if(lt_row.length === 0){return;}

    //tree의 row에 바인딩처리된 정보 얻기.
    var lt_ctxt = oAPP.attr.ui.oLTree1._getRowContexts();

    for(var i=0, l=lt_row.length; i<l; i++){
      //기존 style 제거 처리.
      lt_row[i].removeStyleClass("disableTreeDrop");

      //해당 row에 binding context정보가 존재하지 않는경우 skip.
      if(!lt_ctxt[i] || !lt_ctxt[i].context){
        continue;
      }

      //drop 가능여부 확인.
      var l_drop_enable = lt_ctxt[i].context.getProperty("drop_enable");

      //drop 불가능 상태인경우 css 처리.
      if(l_drop_enable !== true){
        lt_row[i].addStyleClass("disableTreeDrop");
      }

    }


  };  //drop 가능여부 style 처리.



  //drag한 UI가 다른 라인에 올라갔을때 처리.
  oAPP.fn.designDragEnter = function(oEvent){
    var l_row = oEvent.mParameters.dragSession.getDropControl();
    if(!l_row){
      oEvent.preventDefault(true);
      return;
    }

    var l_ctxt = l_row.getBindingContext();

    if(!l_ctxt){
      oEvent.preventDefault(true);
      return;
    }

    var l_drop_enable = l_ctxt.getProperty("drop_enable");

    if(!l_drop_enable){
      oEvent.preventDefault(true);
      return;
    }

  };  //drag한 UI가 다른 라인에 올라갔을때 처리.



  //design tree item drag 시작 이벤트.
  oAPP.fn.designTreeDragStart = function(is_tree){
    
    if(!is_tree){return;}

    //DRAG 시작됨 FLAG 처리.
    oAPP.attr.ui.oLTree1.__isdragStarted = true;

    //drag& drop 가능 처리 default 설정.
    oAPP.fn.setTreeDnDEnable(oAPP.attr.oModel.oData.zTREE[0]);

    //drag한 UI가 drop가능한 라인 판단 처리.
    oAPP.fn.setDropEnable(is_tree);

    //drop 가능여부 css 처리.
    oAPP.fn.designSetDropStyle();


  };  //design tree item drag 시작 이벤트.




  //drop 처리 function.
  oAPP.fn.UIDrop = function(oEvent, i_OBJID){

    if(!i_OBJID){return;}

    //미리보기 영역에서 drag처리한 UI명 얻기.
    var l_objid = oEvent.mParameters.browserEvent.dataTransfer.getData("text/plain");


    //ui 구성정보에서 직접 검색.
    l_drag = oAPP.fn.getTreeData(l_objid);
    if(!l_drag){return;}

    //drop한 UI의 라인정보 얻기.
    var l_drop = oAPP.fn.getTreeData(i_OBJID);
    if(!l_drop){return;}

    //dragUI명과 dropUI명이 같은경우 exit.
    if(l_drag.OBJID === l_drop.OBJID){
      return;
    }

    if(typeof oAPP.fn.aggrSelectPopup !== "undefined"){
      oAPP.fn.aggrSelectPopup(l_drag, l_drop, oAPP.fn.drop_cb);
      return;
    }

    oAPP.fn.getScript("design/js/aggrSelectPopup",function(){
      oAPP.fn.aggrSelectPopup(l_drag, l_drop, oAPP.fn.drop_cb);
    });

  };  //drop 처리 function.


  
  
  //멀티 삭제 처리.
  oAPP.fn.designTreeMultiDeleteItem = function(){
    //선택건 존재여부 확인 펑션.
    function lf_chkSelLine(is_tree){

      //선택 라인 정보가 존재하는 경우.
      if(is_tree.chk === true){
        //찾음 flag return
        return true;
      }

      //child정보가 존재하지 않는경우 exit.
      if(!is_tree.zTREE || is_tree.zTREE.length === 0){return;}

      //child를 탐색하며 선택건 존재여부 확인.
      for(var i=0, l=is_tree.zTREE.length; i<l; i++){
        var l_chk = lf_chkSelLine(is_tree.zTREE[i]);

        //선택건이 존재하는 경우 찾음 flag return
        if(l_chk === true){return true;}
      }

    } //선택건 존재여부 확인 펑션.



    //선택라인 삭제처리.
    function lf_delSelLine(it_tree){

      if(it_tree.length === 0){return;}

      for(var i=it_tree.length-1; i>=0; i--){

        //재귀호출하며 선택한 라인정보 삭제 처리.
        lf_delSelLine(it_tree[i].zTREE);


        //체크박스가 선택된 경우.
        if(it_tree[i].chk === true){

          //클라이언트 이벤트 및 sap.ui.core.HTML의 프로퍼티 입력건 제거 처리.
          oAPP.fn.delUiClientEvent(it_tree[i]);

          //Description 정보 삭제.
          oAPP.fn.delDesc(it_tree[i].OBJID);

          //미리보기에 해당 UI삭제 처리.
          oAPP.attr.ui.frame.contentWindow.delUIObjPreView(it_tree[i].OBJID, it_tree[i].POBID, it_tree[i].UIATT, it_tree[i].ISMLB);

          //UI수집건에 해당 UI 제거 처리.
          delete oAPP.attr.prev[it_tree[i].OBJID];

          //해당 라인 삭제.
          it_tree.splice(i,1);

        }

      }

    } //선택라인 삭제처리.



    //체크박스 선택건 존재여부 확인.
    if(lf_chkSelLine(oAPP.attr.oModel.oData.zTREE[0]) !== true){
      //존재하지 않는경우 오류 메시지 처리.
      parent.showMessage(sap, 20, "I", "체크박스 선택건이 존재하지 않습니다.");
      return;

    }

    //현재 우측에 출력한 UI의 TREE 정보 얻기.
    var ls_tree = oAPP.fn.getTreeData(oAPP.attr.oModel.oData.uiinfo.OBJID);

    //현재 선택건의 OBJID 매핑.
    var l_objid = ls_tree.OBJID;
        
    //해당 라인의 삭제를 위해 선택된경우.
    if(ls_tree.chk === true){
      //선택 라인으로부터 가장 직전의 선택하지 않은 라인 정보 얻기.    
      l_objid = oAPP.fn.designGetPreviousTreeItem(ls_tree.OBJID);

    }

    //직전 라인 정보를 얻지 못한 경우 ROOT를 선택 처리.
    if(typeof l_objid === "undefined"){
      l_objid = "ROOT";
    }


    //삭제전 확인팝업 호출.
    parent.showMessage(sap, 30, "I", "선택한 라인을 삭제하시겠습니까?.",function(oEvent){

      //YES를 선택하지 않은경우 EXIT.
      if(oEvent !== "YES"){return;}

      //선택 라인 삭제 처리.
      lf_delSelLine(oAPP.attr.oModel.oData.zTREE);

      //모델 갱신 처리.
      oAPP.attr.oModel.refresh();

      //메뉴 선택 tree 위치 펼침 처리.
      oAPP.fn.setSelectTreeItem(l_objid);

      //변경 FLAG 처리.
      oAPP.fn.setChangeFlag();

    });

  };  //멀티 삭제 처리.




  //대상 OBJID의 직전 라인 OBJID 얻기.
  oAPP.fn.designGetPreviousTreeItem = function(OBJID){

    var l_bind = oAPP.attr.ui.oLTree1.getBinding(),
        l_ctxt, ls_tree, l_before;

    //현재 화면에 출력됐던 라인 정보를 기준으로 선택 안된 라인 판단.
    for(var i=0, l=oAPP.fn.designGetTreeItemCount(); i<l; i++){

      //context 정보 얻기.
      l_ctxt = l_bind.getContextByIndex(i);
      if(!l_ctxt){break;}

      //해당 라인 정보 얻기.
      ls_tree = l_ctxt.getProperty();

      //현재 UI INFO에 출력되고 있는 UI명과 동일건 까지 탐색한 경우.
      if(OBJID === ls_tree.OBJID){
        //loop 종료.
        break;
      }

      //선택된건이 아닌경우.
      if(ls_tree.chk != true){
        //선택되지 않은건 정보 매핑.
        l_before = ls_tree.OBJID;
      }      

    }

    //직전 라인의 OBJID를 찾지 못한경우 ROOT정보 RETURN.
    return l_before || "ROOT";


  };  //대상 OBJID의 직전 라인의 OBJID 얻기.


  //design tree 영역의 item 수 계산.
  oAPP.fn.designGetTreeItemCount = function(){

    function lf_calcItem(it_tree){
      if(typeof it_tree === "undefined"){return;}

      l_cnt += it_tree.length;

      for(var i=0, l=it_tree.length; i<l; i++){
        lf_calcItem(it_tree[i].zTREE);
      }

    }
    
    var l_cnt = 0;   
    
    lf_calcItem(oAPP.attr.oModel.oData.zTREE);

    return  l_cnt;


  };  //design tree 영역의 item 수 계산.



  //context menu 호출전 메뉴 선택 가능 여부 설정.
  oAPP.fn.beforeOpenContextMenu = function(OBJID){

    var ls_menu = {};

    //default 메뉴 항목 잠금 상태로 설정.
    ls_menu.enab01 = false;   //ui추가 불가
    ls_menu.enab02 = false;   //ui삭제 불가
    ls_menu.enab03 = false;   //ui up 불가
    ls_menu.enab04 = false;   //ui down 불가
    ls_menu.enab05 = false;   //ui move position 불가
    ls_menu.enab06 = false;   //copy 불가
    ls_menu.enab07 = false;   //paste 불가

    //root에서 menu 호출한경우.
    if(OBJID === "ROOT"){
      //context menu 모두 비활성처리.
      oAPP.attr.oModel.setProperty("/lcmenu",ls_menu);
      return;
    }

    //edit 상태인경우.(APP에서 CONTEXT MENU호출건을 처리하기위함)
    if(oAPP.attr.oModel.oData.IS_EDIT === true){
      ls_menu.enab01 = true; //ui추가 가능

      //복사된건 history 존재여부에 따른 붙여넣기 메뉴 활성화 여부 설정.
      ls_menu.enab07 = oAPP.fn.isExistsCopyData("U4AWSuiDesignArea");

    }

    //APP에서 menu 호출한 경우.
    if(OBJID === "APP"){
      oAPP.attr.oModel.setProperty("/lcmenu",ls_menu);
      return;
    }

    //DOCUMENT, APP가 아닌 영역에서 CONTEXT MENU 호출시 display 상태인경우 메뉴 비활성 처리.
    if(oAPP.attr.oModel.oData.IS_EDIT === false){
      ls_menu.enab06 = true; //copy 가능
      oAPP.attr.oModel.setProperty("/lcmenu",ls_menu);
      return;
    }

    //DOCUMENT, APP가 아닌 영역에서 편집 가능한 상태일때 CONTEXT MENU 호출시 하위 로직 수행.

    //context menu 선택 라인 위치의 바인딩 path 정보 얻기.
    var ls_tree = oAPP.fn.getTreeData(OBJID);

    //부모 라인 정보 얻기.
    var l_parent = oAPP.fn.getTreeData(ls_tree.POBID);
    
    //현재 UI가 부모에서의 위치 얻기.
    var l_pos = l_parent.zTREE.findIndex( a=> a.OBJID === OBJID);
    

    //default 설정.
    ls_menu.enab01 = true;   //ui추가 가능
    ls_menu.enab02 = true;   //ui삭제 가능
    ls_menu.enab03 = true;   //ui up 가능
    ls_menu.enab04 = true;   //ui down 가능
    ls_menu.enab05 = true;   //ui move position 가능
    ls_menu.enab06 = true;   //ui copy 활성화.

    //복사된건 history 존재여부에 따른 붙여넣기 메뉴 활성화 여부 설정.
    ls_menu.enab07 = oAPP.fn.isExistsCopyData("U4AWSuiDesignArea");

    //부모의 child정보가 1건인경우.
    if(l_parent.zTREE.length === 1){
      ls_menu.enab03 = false;   //ui up 불가능
      ls_menu.enab04 = false;   //ui down 불가능
      ls_menu.enab05 = false;   //ui move position 불가능

    }else if(l_pos === 0){
      //menu를 선택한 위치가 child중 첫번째라면
      ls_menu.enab03 = false; //ui up 불가능

    }else if(l_pos+1 === l_parent.zTREE.length){
      //menu를 선택한 위치가 child중 마지막이라면.
      ls_menu.enab04 = false;   //ui down 불가능

    }

    //context menu의 바인딩 정보 갱신.
    oAPP.attr.oModel.setProperty("/lcmenu",ls_menu);

    //해당 라인 선택 처리.
    oAPP.fn.setSelectTreeItem(OBJID);
    

  };  //context menu 호출전 메뉴 선택 가능 여부 설정.

})();
