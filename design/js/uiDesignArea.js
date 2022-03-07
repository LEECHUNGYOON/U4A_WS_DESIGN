(function(){

  //visible, editable등의 tree 처리 전용 바인딩 필드 생성 처리.
  oAPP.fn.crtTreeBindField = function(is_0014){

    is_0014.drag_enable = true;  //tree item drag 가능여부 필드
    is_0014.drop_enable = oAPP.attr.oModel.oData.IS_EDIT;  //tree item drop 가능여부 필드

    is_0014.sel = false; //tree item 선택처리 필드

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




  // OBJID의 라인 위치(index) 찾기.
  oAPP.fn.getItemIndex = function(OBJID){

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

    }


    //TREE를 탐색하며 입력 OJBID의 INDEX 정보 찾기.
    return lf_findItem(oAPP.attr.oModel.oData.zTREE);


  };  // OBJID의 라인 위치(index) 찾기.



  //tree item 펼침 처리.
  oAPP.fn.expandTreeItem = function(){

    //tree item 펼침처리 재귀호출 function.
    function lf_expand(is_tree){

      //하위 UI정보가 존재하지 않는경우 position + 1 처리 후 exit.
      if(!is_tree.zTREE || is_tree.zTREE.length === 0){
        l_pos += 1;
        return;
      }

      //하위 UI가 존재하는경우 해당 position 펼첨 처리.
      oAPP.attr.ui.oLTree1.expand(l_pos);

      //다음라인 펼침 처리를 위한 position + 1 처리.
      l_pos += 1;

      //하위 UI정보를 탐색하며 펼침 여부 판단.
      for(var i=0,l=is_tree.zTREE.length; i<l; i++){

        lf_expand(is_tree.zTREE[i], l_pos);

      }

    } //tree item 펼침처리 재귀호출 function.



    //선택 라인 정보 얻기.
    var l_item = oAPP.attr.ui.oLTree1.getSelectedItem();
    if(!l_item){return;}

    var l_ctxt = l_item.getBindingContext();
    if(!l_ctxt){return;}

    //선택한 라인 위치 얻기.
    var l_pos = oAPP.attr.ui.oLTree1.indexOfItem(l_item);

    //재귀 호출처리하며 하위를 탐색하며 펼침 처리.
    lf_expand(l_ctxt.getProperty());


  };  //tree item 펼침 처리.




  //삭제 대상 UI의 클라이언트 이벤트 및 sap.ui.core.HTML의 content 수집 정보 삭제 처리.
  oAPP.fn.delUIClientEvent = function(is_tree){

    //클라이언트 이벤트가 존재하지 않는경우 exit.
    if(oAPP.DATA.APPDATA.T_CEVT.length === 0){return;}

    //프로퍼티 설정건이 존재하지 않는경우 EXIT.
    if(oAPP.attr.prev[is_tree.OBJID]._T_0015.length === 0){return;}


    //sap.ui.core.HTML UI인경우.
    if(is_tree.UIFND === "SAP.UI.CORE.HTML"){
      //content 프로퍼티에 직접 입력한 내용이 존재하는지 확인.
      var l_findx = oAPP.DATA.APPDATA.T_CEVT.findIndex( a => a.OBJID === is_tree.OBJID + 'CONTENT' && a.OBJTY === "HM");

      if(l_findx !== -1){
        //해당 HTML 삭제 처리.
        oAPP.DATA.APPDATA.T_CEVT.splice(l_findx, 1);
      }

    }

    //이벤트 설정건 존재여부 확인.
    var lt_evt = oAPP.attr.prev[is_tree.OBJID]._T_0015.filter( a => a.UIATY === '2' );

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




  //클라이언트 이벤트, HTML정보 복사 처리.
  oAPP.fn.copyUIClientEvent = function(OBJID, is_tree){

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
  oAPP.fn.setSelectTreeItem = function(OBJID){

    //입력 UI로 부터 상위를 탐색하며 PATH정보 수집.
    function lf_getTreePath(OBJID){

      //내 UI 구조 정보 얻기.
      var ls_parent = oAPP.attr.oModel.oData.TREE.find( a => a.OBJID === OBJID );
      if(!ls_parent){return;}

      //내 정보 수집.
      lt_path.splice(0, 0, ls_parent.OBJID);


      //내 부모가 없으면 EXIT.
      if(ls_parent.POBID === ""){return;}

      //내 부모를 재귀호출 탐색하며 PATH정보 수집처리.
      lf_getTreePath(ls_parent.POBID);

    } //입력 UI로 부터 상위를 탐색하며 PATH정보 수집.


    var lt_path = [];


    //입력 UI명으로 부터 부모까지의 PATH 정보 검색.
    lf_getTreePath(OBJID);

    //path 정보를 수집하지 않은경우 exit.
    if(lt_path.length === 0){return;}

    //현재 tree의 item을 탐색하며 수집된 path에 해당하는 건인경우 펼침처리.
    for(var i=0, l=lt_path.length; i<l; i++){
      //좌측 tree영역의 item정보 얻기.
      lt_item = oAPP.attr.ui.oLTree1.getItems();

      //현재 화면에 출력된 item을 탐색하며 수집된 path에 해당건여부 확인.
      for(var j=0, l2 = lt_item.length; j<l2; j++){

        var l_ctxt = lt_item[j].getBindingContext();

        //item의 OBJID얻기.
        var l_objid = l_ctxt.getProperty("OBJID");

        //수집된 PATH와 동일 OBJID가 아닌경우 SKIP.
        if(l_objid !== lt_path[i]){continue;}

        //입력UI와 동일건인경우. 선택 처리.
        if(OBJID === lt_path[i]){
          lt_item[j].setSelected(true);
          oAPP.attr.ui.oLTree1.fireItemPress({listItem:lt_item[j]});
          return;
        }

        //해당 item이 펼쳐지지 않은경우.
        if(lt_item[j].getExpanded() !== true){
          //path에 해당하는 라인 펼침 처리.
          oAPP.attr.ui.oLTree1.expand(j);
        }

        break;

      }

    }

  };  //tree item 선택 처리




  //생성한 UI명 채번
  oAPP.fn.setOBJID = function(objid){

    var l_cnt = 1;
      var l_upper = objid.toUpperCase();
      var l_objid = l_upper + l_cnt;

      var l_found = false,
          l_stru;

      while(l_found !== true){

        //구성한 objid와 동일건 존재여부 확인.
        l_indx = oAPP.attr.oModel.oData.TREE.findIndex( a => a.OBJID === l_objid);
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

      //drag한 UI 선택 처리.
      oAPP.fn.setSelectTreeItem(i_drag.OBJID);

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

    //미리보기 갱신 처리.
    oAPP.attr.ui.frame.contentWindow.moveUIObjPreView(i_drag.OBJID, i_drag.POBID, i_drag.UIATT, l_parent.zTREE.length, i_drag.ISMLB);

    //drag한 UI 선택 처리.
    oAPP.fn.setSelectTreeItem(i_drag.OBJID);

    //변경 FLAG 처리.
    oAPP.fn.setChangeFlag();

  }; //drop callback 이벤트.




  //좌측 페이지(UI Design 영역) 구성.
  oAPP.fn.uiDesignArea = function(oLPage){

    var oModel = oLPage.getModel();

    var oLTree1 = new sap.m.Tree({mode:"SingleSelectMaster",sticky:["HeaderToolbar"]});
    oLPage.addContent(oLTree1);

    //tree instance 정보 광역화.
    oAPP.attr.ui.oLTree1 = oLTree1;

    sap.m.CustomTreeItem.getMetadata().dnd.draggable = true;
    sap.m.CustomTreeItem.getMetadata().dnd.droppable = true;

    //tree Item
    var oLTItem1 = new sap.m.CustomTreeItem({type:"Active",selected:"{sel}"});

    //tree 라인 선택 이벤트.
    oLTree1.attachItemPress(function(oEvent){

      //선택 라인 정보 얻기.
      var ls_tree = oEvent.mParameters.listItem.getBindingContext().getProperty();

      //동일한 라인을 선택한 경우 exit.
      if(oAPP.attr.oModel.oData.uiinfo && oAPP.attr.oModel.oData.uiinfo.OBJID === ls_tree.OBJID){
        return;
      }

      var l_path = oEvent.mParameters.listItem.getBindingContext().getPath();

      //UI Info 영역 갱신 처리.
      oAPP.fn.setUIInfo(ls_tree, l_path);


      //선택한 ui에 해당하는 attr로 갱신 처리.
      oAPP.fn.updateAttrList(ls_tree.UIOBK, ls_tree.OBJID);


      //미리보기 화면 갱신 처리.
      oAPP.attr.ui.frame.contentWindow.refreshPreview(ls_tree);


      //팝업 호출건 강제 종료 처리.
      oAPP.attr.ui.frame.contentWindow.closePopup();


      //미리보기 ui 선택 처리
      oAPP.attr.ui.frame.contentWindow.selPreviewUI(ls_tree.OBJID);


      //해당 아이템으로 focus 처리.
      oEvent.mParameters.listItem.focus();


    }); //tree 라인 선택 이벤트.



    //트리 펼침처리 이벤트
    oLTree1.attachToggleOpenState(function(){


    }); //트리 펼침처리 이벤트



    var oLHBox1 = new sap.m.HBox({width:"100%",alignItems:"Center", justifyContent:"SpaceBetween",wrap:"Wrap"});
    oLTItem1.addContent(oLHBox1);

    var oLHBox2 = new sap.m.HBox({alignItems:"Center",wrap:"Wrap"});
    oLHBox1.addItem(oLHBox2);


    //라인 선택 checkbox
    var oChk1 = new sap.m.CheckBox({visible:"{chk_visible}",selected:"{chk}"});
    oLHBox2.addItem(oChk1);

    //checkbox 선택 이벤트.
    oChk1.attachSelect(function(oEvent){

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
      function lf_setCheckParent(oItem){

        if(!oItem){return;}
        var l_ctxt = oItem.getBindingContext();
        if(!l_ctxt){return;}

        var ls_parent = l_ctxt.getProperty();

        if(ls_parent.OBJID === "ROOT" || ls_parent.OBJID === "APP"){
          return;
        }

        ls_parent.chk = false;

        //부모를 탐색하면서 체크 해제 처리.
        lf_setCheckParent(oItem.getParentNode());


      } //현재 UI의 부모를 탐색하면서 체크박스 해제 처리.



      //이벤트 발생 라인의 바인딩정보 얻기.
      var l_ctxt = this.getBindingContext();
      if(!l_ctxt){return;}

      //바인딩 데이터 얻기.
      var ls_0015 = l_ctxt.getProperty();

      //이벤트 발생 라인부터 하윈를 탐색하며 체크박스 선택/해제 처리.
      lf_setCheckAllChild(ls_0015, ls_0015.chk);

      //현재 이벤트가 발생한 라인의 체크박스가 해제된경우.
      if(ls_0015.chk === false){
        //부모를 탐색하면서 체크박스 해제 처리.
        lf_setCheckParent(this.oParent.oParent.oParent);
      }

      oAPP.attr.oModel.refresh();

    });



    //UI명.
    var oLtxt1 = new sap.m.Text({text:"{OBJID}"});
    oLHBox2.addItem(oLtxt1);

    //부모 Aggregation
    var oLtxt2 = new sap.m.Text({text:"{UIATT}"});
    oLHBox1.addItem(oLtxt2);


    var oLTDrag1 = new sap.ui.core.dnd.DragInfo({enabled:"{drag_enable}"});
    oLTItem1.addDragDropConfig(oLTDrag1);

    var oLTDrop1 = new sap.ui.core.dnd.DropInfo({enabled:"{drop_enable}"});
    oLTItem1.addDragDropConfig(oLTDrop1);

    //drag start 이벤트
    oLTDrag1.attachDragStart(function(oEvent){

      //drag& drop 가능 처리 default 설정.
      oAPP.fn.setTreeDnDEnable(oAPP.attr.oModel.oData.zTREE[0]);

      //drag UI가 DOCUMENET, APP인경우 EXIT.
      if(oLTree1.indexOfItem(oEvent.mParameters.target) === 0){
        oEvent.preventDefault();
        return;
      }


      //drag한 위치의 바인딩 정보 얻기.
      var ls_drag = oModel.getProperty("",oEvent.mParameters.target.getBindingContext());


      event.dataTransfer.setData("text/plain", ls_drag.OBJID);

      var oDragSession = oEvent.getParameter("dragSession");
      oDragSession.setData("RTMCLS", ls_drag.UILIB);

      //drag한 위치의 바인딩 path 정보 얻기.
      var l_dragPath = oEvent.mParameters.target.getBindingContextPath();

      var lt_0027 = oAPP.DATA.LIB.T_0027.filter( a => a.TGOBJ === ls_drag.UIOBK && a.TOBTY === "3");

      //drag UI 기준으로 drop 가능한 UI에 대한 활성여부 처리.
      var lt_item = oLTree1.getItems();
      var lt_0022,l_ctxt,ls_tree,lt_0023,lt_0027,l_upper,ls_0022,l_found,l_path;

      //DOCUMENT는 drop false 처리.
      lt_item[0].mAggregations.dragDropConfig[1].setEnabled(false);
      lt_item[0].addStyleClass("disableTreeDrop");

      //ui design영역에 출력된 tree item기준으로 drop 가능 여부 설정.
      for(var i=1, l=lt_item.length; i<l;i++){

        l_path = lt_item[i].getBindingContextPath();

        //drag UI의 child에 해당하는 UI인경우.
        if(l_dragPath === l_path.substr(0,l_dragPath.length)){
          lt_item[i].mAggregations.dragDropConfig[1].setEnabled(false);
          lt_item[i].addStyleClass("disableTreeDrop");
          continue;
        }

        l_ctxt = lt_item[i].getBindingContext();
        ls_tree = oModel.getProperty("",l_ctxt);


        //aggregation 정보 얻기.
        lt_0023 = oAPP.DATA.LIB.T_0023.filter(a => a.UIOBK === ls_tree.UIOBK && a.UIATY === "3");

        //aggregation 정보가 존재하지 않는경우 drop 비활성 처리.
        if(!lt_0023){
          lt_item[i].mAggregations.dragDropConfig[1].setEnabled(false);
          lt_item[i].addStyleClass("disableTreeDrop");
          continue;
        }

        l_found = false;
        for(var j=0, l2 = lt_0023.length; j<l2; j++){
          l_upper = lt_0023[j].UIADT.toUpperCase();

          ls_0022 = oAPP.DATA.LIB.T_0022.find( a => a.UIFND === l_upper);
          if(!ls_0022){continue;}

          ls_0027 = oAPP.DATA.LIB.T_0027.find( a => a.SGOBJ === ls_0022.UIOBK && a.TGOBJ === ls_drag.UIOBK );

          if(!ls_0027){continue;}

          l_found = true;
          break;

        }

        if(!l_found){
          lt_item[i].mAggregations.dragDropConfig[1].setEnabled(false);
          lt_item[i].addStyleClass("disableTreeDrop");
        }

      } //ui design영역에 출력된 tree item기준으로 drop 가능 여부 설정.

    }); //drag start 이벤트



    //drag 종료이벤트
    oLTDrag1.attachDragEnd(function(oEvent){

      //tree drag & drop 가능여부 처리.
      oAPP.fn.setTreeDnDEnable(oAPP.attr.oModel.oData.zTREE[0]);
      oAPP.attr.oModel.refresh();

      var lt_item = oLTree1.getItems();

      for(var i=0, l=lt_item.length; i<l;i++){
        //drag 종료시 drop 불가능 css 제거 처리.
        lt_item[i].removeStyleClass("disableTreeDrop");
      }

    }); //drag 종료이벤트



    //부모를 탐색하며, n건 바인딩 처리 여부 됐는지 확인.
    function lf_chkModelBindParent(oUI,aggr){
      if(!oUI){return;}

      //model 바인딩 처리된경우.
      if(typeof oUI._MODEL[aggr] !== "undefined"){
        return oUI._MODEL[aggr];
      }

      //model 바인딩 처리가 안된경우 상위 부모를 재귀 호출 탐색하며 n건 바인딩 쳐부 확인.
      lf_chkModelBindParent(oUI._parent, oUI._EMBED_AGGR);

    } // end lf_chkModelBindParent



    //바인딩 해제 처리.
    function lf_clearModelBind(is_tree){

      //drag한 UI의 부모를 탐색하며, n건 바인딩 path 확인.
      var l_path = lf_chkModelBindParent(oAPP.attr.prev[is_tree.OBJID], oAPP.attr.prev[is_tree.OBJID]._EMBED_AGGR);

      //n건 바인딩 처리되지 않은경우 exit.
      if(typeof l_path === "undefined"){
        return;
      }

      //n건 바인딩 처리된 ui의 바인딩 해제.
      for(var i=0, l=oAPP.attr.prev[is_tree.OBJID]._BIND_AGGR.length; i<l; i++){

      }

      //model 바인딩 정보 확인.
      for(var i in  oAPP.attr.prev[is_tree.OBJID]._MODEL){
        //부모 path로부터 파생된 child path가 아닌경우 skip.
        if(oAPP.fn.chkBindPath(l_path, oAPP.attr.prev[is_tree.OBJID]._MODEL[i]) !== true){
          continue;
        }

        //model 정보 삭제.
        delete oAPP.attr.prev[is_tree.OBJID]._MODEL[i];

      }

      for(var i=0, l=oAPP.attr.prev[is_tree.OBJID]._T_0015.length; i<l; i++){
        //부모 path로부터 파생된 child path가 아닌경우 skip.
        if(oAPP.fn.chkBindPath(l_path, oAPP.attr.prev[is_tree.OBJID]._T_0015[i]) !== true){
          continue;
        }

        //해당 라인 삭제 처리.
        oAPP.attr.prev[is_tree.OBJID]._T_0015[i].splice(i,1);

      }

    } //바인딩 해제 처리.




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




    //drop 이벤트.
    oLTDrop1.attachDrop(function(oEvent){

      if(!oEvent.mParameters.droppedControl){return;}

      var l_drop = oModel.getProperty("",oEvent.mParameters.droppedControl.getBindingContext());

      //DROP 처리.
      oAPP.fn.UIDrop(oEvent, l_drop.OBJID);


    }); //drop 이벤트.




    //Context menu open전 이벤트.
    oLTree1.attachBeforeOpenContextMenu(function(oEvent){

      var ls_menu = {};

      //default 메뉴 항목 잠금 상태로 설정.
      ls_menu.enab01 = false;   //ui추가 불가
      ls_menu.enab02 = false;   //ui삭제 불가
      ls_menu.enab03 = false;   //ui up 불가
      ls_menu.enab04 = false;   //ui down 불가
      ls_menu.enab05 = false;   //ui move position 불가
      ls_menu.enab06 = false;   //copy 불가
      ls_menu.enab07 = false;   //paste 불가

      //context menu 호출 라인 정보를 얻을 수 없는경우.
      if(!oEvent.mParameters || !oEvent.mParameters.listItem){
        //context menu 모두 비활성처리.
        oAPP.attr.oModel.setProperty('/lcmenu',ls_menu);
        return;
      }

      var l_indx = this.indexOfItem(oEvent.mParameters.listItem);

      //root에서 menu 호출한경우.
      if(l_indx === 0){
        //context menu 모두 비활성처리.
        oAPP.attr.oModel.setProperty('/lcmenu',ls_menu);
        return;
      }

      //edit 상태인경우.(APP에서 CONTEXT MENU호출건을 처리하기위함)
      if(oAPP.attr.oModel.oData.IS_EDIT === true){
        ls_menu.enab01 = true; //ui추가 가능

        //복사된건 history 존재여부에 따른 붙여넣기 메뉴 활성화 여부 설정.
        ls_menu.enab07 = oAPP.fn.isExistsCopyData('U4AWSuiDesignArea');

      }

      //APP에서 menu 호출한 경우.
      if(l_indx === 1){
        oAPP.attr.oModel.setProperty('/lcmenu',ls_menu);
        return;
      }

      //DOCUMENT, APP가 아닌 영역에서 CONTEXT MENU 호출시 display 상태인경우 메뉴 비활성 처리.
      if(oAPP.attr.oModel.oData.IS_EDIT === false){
        ls_menu.enab06 = true; //copy 가능
        oAPP.attr.oModel.setProperty('/lcmenu',ls_menu);
        return;
      }

      //DOCUMENT, APP가 아닌 영역에서 편집 가능한 상태일때 CONTEXT MENU 호출시 하위 로직 수행.

      //context menu 선택 라인 위치의 바인딩 path 정보 얻기.
      var l_path = oEvent.mParameters.listItem.getBindingContextPath();

      //현재 라인 정보 얻기.
      var ls_tree = oAPP.attr.oModel.getProperty(l_path);

      //부모의 child들 정보 얻기
      var l_parent = oAPP.attr.oModel.getProperty(l_path.substr(0,l_path.lastIndexOf('/')));

      //menu 선택한 위치 얻기.
      var l_pos = parseInt(l_path.substr(l_path.lastIndexOf('/')+1));

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
      if(l_parent.length === 1){
        ls_menu.enab03 = false;   //ui up 불가능
        ls_menu.enab04 = false;   //ui down 불가능
        ls_menu.enab05 = false;   //ui down 불가능

      }else if(l_pos === 0){
        //menu를 선택한 위치가 child중 첫번째라면
        ls_menu.enab03 = false; //ui up 불가능

      }else if(l_pos+1 === l_parent.length){
        //menu를 선택한 위치가 child중 마지막이라면.
        ls_menu.enab04 = false;   //ui down 불가능

      }

      oAPP.attr.oModel.setProperty('/lcmenu',ls_menu);

      oAPP.fn.setSelectTreeItem(ls_tree.OBJID);

      //oEvent.mParameters.listItem.setSelected(true);

    }); //Context menu open전 이벤트.



    var oLTBar1 = new sap.m.Toolbar();
    oLTree1.setHeaderToolbar(oLTBar1);

    //펼침 아이콘
    var oLBtn1 = new sap.m.Button({icon:"sap-icon://expand-group"});
    oLTBar1.addContent(oLBtn1);

    //펼침 이벤트
    oLBtn1.attachPress(function(){
      //선택 라인의 하위 UI 펼침처리.
      oAPP.fn.expandTreeItem(true);

    }); //펼침 이벤트



    //접힘 아이콘
    var oLBtn2 = new sap.m.Button({icon:"sap-icon://collapse-group"});
    oLTBar1.addContent(oLBtn2);

    //접힘 이벤트
    oLBtn2.attachPress(function(){
      var l_item = oLTree1.getSelectedItem();
      if(!l_item){
        oLTree1.collapse(0);
        return;
      }

      oLTree1.collapse(oLTree1.indexOfItem(l_item));

    }); //접힘 이벤트



    //구분자 추가.
    oLTBar1.addContent(new sap.m.ToolbarSeparator());

    //삭제 버튼.
    var oLBtn3 = new sap.m.Button({icon:"sap-icon://delete",visible:"{/IS_EDIT}"});
    oLTBar1.addContent(oLBtn3);

    //삭제버튼 선택 이벤트
    oLBtn3.attachPress(function(oEvent){

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
            oAPP.fn.delUIClientEvent(it_tree[i]);

            //Description 정보 삭제.
            oAPP.fn.deltDesc(it_tree[i].OBJID);

            //미리보기에 해당 UI삭제 처리.
            oAPP.attr.ui.frame.contentWindow.delUIObjPreView(it_tree[i].OBJID, it_tree[i].POBID, it_tree[i].UIATT, it_tree[i].ISMLB);

            //UI수집건에 해당 UI 제거 처리.
            delete oAPP.attr.prev[it_tree[i].OBJID];

            //해당 라인 삭제.
            it_tree.splice(i,1);

          }

        }

      } //선택라인 삭제처리.



      //라인선택한 item을 기준으로 부모를 탐색하며, checkbox를 선택하지 않은 정보 검색.
      function lf_getSelItemOBJID(oItem){

        //item정보가 존재하지 않는경우.
        if(!oItem){return;}

        var l_ctxt = oItem.getBindingContext();
        if(!l_ctxt){return;}

        var l_item = l_ctxt.getProperty();

        //선택이 안된건인경우.
        if(l_item.chk !== true){
          //해당 아이템의 UI명 return.
          return l_item;
        }

        //선택된경우 상위 부모를 탐색하며 선택 안된건 검색.
        return lf_getSelItemOBJID(oItem.getParentNode());

      } //라인선택한 item을 기준으로 부모를 탐색하며, checkbox를 선택하지 않은 정보 검색.



      //체크박스 선택건 존재여부 확인.
      if(lf_chkSelLine(oAPP.attr.oModel.oData.zTREE[0]) !== true){
        //존재하지 않는경우 오류 메시지 처리.
        showMessage(sap, 20, 'I', '체크박스 선택건이 존재하지 않습니다.');
        return;

      }



      //라인선택한 item을 기준으로 부모를 탐색하며, checkbox를 선택하지 않은 정보 검색.
      var ls_selItem = lf_getSelItemOBJID(oAPP.attr.ui.oLTree1.getSelectedItem());


      //삭제전 확인팝업 호출.
      parent.showMessage(sap, 30, 'I', '선택한 라인을 삭제하시겠습니까?.',function(oEvent){

        //YES를 선택하지 않은경우 EXIT.
        if(oEvent !== "YES"){return;}

        //선택 라인 삭제 처리.
        lf_delSelLine(oAPP.attr.oModel.oData.zTREE);

        //모델 갱신 처리.
        oAPP.attr.oModel.refresh();

        //메뉴 선택 tree 위치 펼침 처리.
        oAPP.fn.setSelectTreeItem(ls_selItem.OBJID);

        //변경 FLAG 처리.
        oAPP.fn.setChangeFlag();

      });

    });



    var oLCmenu1 = new sap.m.Menu();
    oLTree1.setContextMenu(oLCmenu1);

    //UI 추가 메뉴
    var oLCMItem1 = new sap.m.MenuItem({icon:"sap-icon://add",text:"Insert Element",enabled:"{/lcmenu/enab01}"});
    oLCmenu1.addItem(oLCMItem1);

    //UI 추가 이벤트
    oLCMItem1.attachPress(function(oEvent){

      //UI 추가.
      function lf_setChild(a){

        if(!l_stru.zTREE){
          l_stru.zTREE = [];
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
          l_14.POBID = l_stru.OBJID;
          l_14.UIOBK = a.E_UIOBJ.UIOBK;
          l_14.PUIOK = l_stru.UIOBK;

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

          l_14.sel   = true;


          l_stru.zTREE.push(l_14);
          oModel.oData.TREE.push(l_14);

          var ls_0015 = oAPP.fn.crtStru0015();

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
        oModel.refresh(true);

        //메뉴 선택 tree 위치 펼침 처리.
        oAPP.fn.setSelectTreeItem(l_14.OBJID);


        //변경 FLAG 처리.
        oAPP.fn.setChangeFlag();

      } //UI 추가.



      var l_stru = oModel.getProperty("",oEvent.oSource.getBindingContext());

      if(typeof oAPP.fn.callUIInsertPopup === "undefined"){
        oAPP.fn.getScript("design/js/insertUIPopop",function(){
          oAPP.fn.callUIInsertPopup(l_stru.UIOBK,lf_setChild);
        });

      }else{
        oAPP.fn.callUIInsertPopup(l_stru.UIOBK,lf_setChild);
      }

    });




    //UI 삭제 메뉴
    var oLCMItem2 = new sap.m.MenuItem({icon:"sap-icon://delete",text:"Delete",enabled:"{/lcmenu/enab02}"});
    oLCmenu1.addItem(oLCMItem2);

    //UI삭제 메뉴 선택 이벤트.
    oLCMItem2.attachPress(function(oEvent){

      //미리보기 UI 수집 항목에서 대상 UI 제거 처리.
      function lf_delUIList(tree){

        //미리보기 UI 수집항목에서 해당 OBJID건 삭제.
        delete oAPP.attr.prev[tree.OBJID];

        //하위 UI정보가 존재하는 경우.
        if(tree.zTREE && tree.zTREE.length !==0){

          //하위 UI정보를 재귀호출 처리 하며 삭제 처리.
          for(var i=0, l=tree.zTREE.length; i<l; i++){
            lf_delUIList(tree.zTREE[i]);
          }

        }

      } //미리보기 UI 수집 항목에서 대상 UI 제거 처리.



      //TREE를 하위 탐색하면서 삭제 대상 ITEM 제거 처리.
      function lf_deleteTreeLine(tree){

        if(tree.length === 0){return;}

        for(var i=0, l=tree.length; i<l; i++){
          //UI명에 해당하는건인경우 삭제 처리.
          if(tree[i].OBJID === l_stru.OBJID){

            //클라이언트 이벤트 및 sap.ui.core.HTML의 프로퍼티 입력건 제거 처리.
            oAPP.fn.delUIClientEvent(tree[i]);

            //Description 삭제.
            oAPP.fn.deltDesc(tree[i].OBJID);

            //미리보기 UI 수집건 제거 처리.
            lf_delUIList(tree[i]);

            //tree에서 해당 라인 제거.
            tree.splice(i,1);
            return;
          }

          //하위 TREE 정보가 존재하는경우 재귀호출 탐색.
          if(tree[i].zTREE && tree[i].zTREE.length !== 0){
            lf_deleteTreeLine(tree[i].zTREE);
          }
        }

      } //TREE를 하위 탐색하면서 삭제 대상 ITEM 제거 처리.



      //삭제 대상 라인 정보.
      var l_stru = oModel.getProperty("",oEvent.oSource.getBindingContext());

      //UI삭제전 확인 팝업 호출.
      parent.showMessage(sap, 30, 'I', '선택한 라인을 삭제하시겠습니까?.',function(oEvent){

        if(oEvent !== "YES"){return;}


        var l_indx = oLTree1.indexOfItem(oLTree1.getSelectedItem());

        var oItem = oLTree1.getItems()[l_indx-1];

        var l_ctxt = oItem.getBindingContext();

        var ls_0015 = l_ctxt.getProperty();

        //미리보기 화면 UI 제거.
        oAPP.attr.ui.frame.contentWindow.delUIObjPreView(l_stru.OBJID, l_stru.POBID, l_stru.UIATT, l_stru.ISMLB);

        //선택 라인 삭제 처리.
        lf_deleteTreeLine(oModel.oData.zTREE);

        //tree에서 삭제처리한 기준으로 저장 데이터 재구성.
        oModel.oData.TREE = oAPP.fn.parseTree2Tab(oModel.oData.zTREE);

        //삭제라인의 바로 윗 라인 선택 처리.
        oAPP.fn.setSelectTreeItem(ls_0015.OBJID);

        oModel.refresh(true);

        //변경 FLAG 처리.
        oAPP.fn.setChangeFlag();

      }); //UI삭제전 확인 팝업 호출.



    }); //UI삭제 메뉴 선택 이벤트.



    //ui 이동처리 function
    function lf_moveUI(ctxt, sign, pos){

      var l_path = ctxt.getPath();

      var ls_tree = ctxt.getProperty();

      var l_parent = oAPP.attr.oModel.getProperty(l_path.substr(0,l_path.lastIndexOf('/')));
      var l_pos = parseInt(l_path.substr(l_path.lastIndexOf('/')+1));

      //현재 이동하는 UI의 동일 AGGR건
      var lt_filt = l_parent.filter( a => a.UIATT === ls_tree.UIATT );

      var l_indx1 = lt_filt.findIndex( a => a.OBJID === ls_tree.OBJID );

      var ls_tree = l_parent[l_pos];

      l_parent.splice(l_pos,1);

      if(sign === "-"){
        l_parent.splice(l_pos-1, 0, ls_tree);

      }else if(sign === "+"){
        l_parent.splice(l_pos+1, 0, ls_tree);

      }else if(typeof pos !== "undefined"){

        l_parent.splice(pos, 0, ls_tree);

      }

      oAPP.attr.oModel.refresh();

      var lt_filt = l_parent.filter( a => a.UIATT === ls_tree.UIATT );

      var l_indx2 = lt_filt.findIndex( a => a.OBJID === ls_tree.OBJID );

      if(l_indx1 !== l_indx2){
        //미리보기 갱신 처리.
        oAPP.attr.ui.frame.contentWindow.moveUIObjPreView(ls_tree.OBJID, ls_tree.POBID, ls_tree.UIATT,l_indx2);

      }

      //변경 FLAG 처리.
      oAPP.fn.setChangeFlag();

      //미리보기 ui 선택.
      oAPP.attr.ui.frame.contentWindow.selPreviewUI(ls_tree.OBJID);

    } //ui 이동처리 function



    //UI up
    var oLCMItem3 = new sap.m.MenuItem({icon:"sap-icon://navigation-up-arrow",text:"Up",enabled:"{/lcmenu/enab03}"});
    oLCmenu1.addItem(oLCMItem3);

    //UI up 메뉴 선택 이벤트
    oLCMItem3.attachPress(function(oEvent){


      lf_moveUI(oEvent.oSource.getBindingContext(),'-');
    });

    //UI down
    var oLCMItem4 = new sap.m.MenuItem({icon:"sap-icon://navigation-down-arrow",text:"Down",enabled:"{/lcmenu/enab04}"});
    oLCmenu1.addItem(oLCMItem4);

    //UI down 메뉴 선택 이벤트
    oLCMItem4.attachPress(function(oEvent){
      lf_moveUI(oEvent.oSource.getBindingContext(),'+');

    }); //UI down 메뉴 선택 이벤트



    //UI move Position
    var oLCMItem5 = new sap.m.MenuItem({icon:"sap-icon://outdent",text:"Move Position",enabled:"{/lcmenu/enab05}"});
    oLCmenu1.addItem(oLCMItem5);

    //UI move Position 메뉴 선택 이벤트
    oLCMItem5.attachPress(function(oEvent){

      function lf_callback(pos){
        lf_moveUI(l_ctxt, undefined, pos);
      }

      var l_ctxt = oEvent.oSource.getBindingContext();

      var l_path = l_ctxt.getPath();

      var l_parent = oAPP.attr.oModel.getProperty(l_path.substr(0,l_path.lastIndexOf('/')));

      var l_pos = parseInt(l_path.substr(l_path.lastIndexOf('/')+1)) + 1;


      if(typeof oAPP.fn.uiMovePosition === "undefined"){
        oAPP.fn.getScript("design/js/uiMovePosition",function(){
          oAPP.fn.uiMovePosition(l_pos,l_parent.length,lf_callback);
        });

      }else{
          oAPP.fn.uiMovePosition(l_pos,l_parent.length,lf_callback);
      }

    }); //UI move Position 메뉴 선택 이벤트



    //copy 메뉴.
    var oLCMItem6 = new sap.m.MenuItem({icon:"sap-icon://copy",text:"Copy",enabled:"{/lcmenu/enab06}"});
    oLCmenu1.addItem(oLCMItem6);

    //copy 메뉴 선택 이벤트
    oLCMItem6.attachPress(function(oEvent){

      var l_bind = this.getBindingContext();

      var ls_tree = l_bind.getProperty();

      //DOCUMENT, APP에서 COPY한경우 EXIT.
      if(ls_tree.OBJID === "ROOT" || ls_tree.OBJID === "APP"){
        return;
      }

      //현재 라인 정보를 복사 처리.
      oAPP.fn.setCopyData('U4AWSuiDesignArea', ['U4AWSuiDesignArea'], ls_tree);


    }); //copy 메뉴 선택 이벤트



    //paste 메뉴.
    var oLCMItem7 = new sap.m.MenuItem({icon:"sap-icon://paste",text:"Paste",enabled:"{/lcmenu/enab07}"});
    oLCmenu1.addItem(oLCMItem7);

    //paste 메뉴 선택 이벤트
    oLCMItem7.attachPress(function(oEvent){

      //붙여넣기 처리된 UI의 OBJID 재 매핑 처리.
      function lf_set_objid(is_paste, PARENT,agrParam){

        //복사전 원본 OBJID 매핑.
        var l_objid = is_paste.OBJID;

        //신규 14번 구조 생성.
        var ls_14 = oAPP.fn.crtStru0014();

        //바인딩 처리 필드 생성.
        oAPP.fn.crtTreeBindField(ls_14);


        //기존 복사건을 신규 14번 구조에 매핑.
        oAPP.fn.moveCorresponding(is_paste, ls_14);

        //복사된 ui의 최상위 정보의 aggregation 정보 변경처리.
        if(agrParam){
          ls_14.UIATK = agrParam.UIATK;
          ls_14.UIATT = agrParam.UIATT;
          ls_14.UIASN = agrParam.UIASN;
          ls_14.UIATY = agrParam.UIATY;
          ls_14.UIADT = agrParam.UIADT;
          ls_14.UIADS = agrParam.UIADS;
          ls_14.ISMLB = agrParam.ISMLB;
          ls_14.PUIATK = agrParam.UIATK;

        }

        ls_14.zTREE = [];

        //OBJID에 포함된 숫자 제거.
        ls_14.OBJID = ls_14.OBJID.replace(/\d/g,'');

        //현재 UI의 OBJID 재 매핑.
        ls_14.OBJID = oAPP.fn.setOBJID(ls_14.OBJID);

        //부모의 ID 변경된 ID 매핑.
        ls_14.POBID = PARENT;

        //복사된 UI의 신규 POSITION 정보 매핑.
        ls_14.POSIT = oAPP.attr.oModel.oData.TREE.length + 1;

        //14번 저장정보에 복사된 ui추가.
        oAPP.attr.oModel.oData.TREE.push(ls_14);

        var lt_0015 = [];

        //원본 UI의 프로퍼티 세팅건이 존재하는경우 해당 내용 복사 처리.
        if(oAPP.attr.prev[l_objid]._T_0015.length !== 0){

          for(var i=0, l=oAPP.attr.prev[l_objid]._T_0015.length; i<l; i++){

            //프로퍼티 구조 신규 생성.
            var ls_15 = oAPP.fn.crtStru0015();

            //기존 복사건을 신규 15번 구조에 매핑.
            oAPP.fn.moveCorresponding(oAPP.attr.prev[l_objid]._T_0015[i], ls_15);

            //복사된 UI의 새로 구성한 OBJID 매핑.
            ls_15.OBJID = ls_14.OBJID;

            //복사된 ui의 최상위 정보의 aggregation 정보 변경처리.
            if(agrParam && ls_15.UIATY === "6"){
              ls_15.UIATK = agrParam.UIATK;
              ls_15.UIATT = agrParam.UIATT;
              ls_15.UIASN = agrParam.UIASN;
              ls_15.UIADT = agrParam.UIADT;
              ls_15.UIADS = agrParam.UIADS;
              ls_15.ISMLB = agrParam.ISMLB;

            }

            //프로퍼티 복사건 재수집 처리.
            lt_0015.push(ls_15);

          }

        } //원본 UI의 프로퍼티 세팅건이 존재하는경우 해당 내용 복사 처리.


        //Description 정보 복사.
        oAPP.fn.copyDesc(l_objid, ls_14.OBJID);

        //Client event 정보 복사.
        oAPP.fn.copyUIClientEvent(l_objid, ls_14);


        //미리보기 UI 추가
        oAPP.attr.ui.frame.contentWindow.addUIObjPreView(ls_14.OBJID, ls_14.UIOBK, ls_14.UILIB, ls_14.UIFND, ls_14.POBID, ls_14.UIATT, lt_0015, lt_ua018);


        //하위 UI 정보가 존재하지 않는경우 EXIT.
        if(!is_paste.zTREE || is_paste.zTREE.length === 0){
          return ls_14;
        }

        //하위 UI를 기준으로 재귀호출 처리하며 OBJID 재 매핑.
        for(var i=0, l=is_paste.zTREE.length; i<l; i++){
          //재귀호출을 통한 OBJID 재 매핑 처리.
          ls_14.zTREE.push(lf_set_objid(is_paste.zTREE[i], ls_14.OBJID));

        }

        return ls_14;

      } //붙여넣기 처리된 UI의 OBJID 재 매핑 처리.



      //붙여넣기 callback 이벤트.
      function lf_paste_cb(param){

        //공통코드 미리보기 UI Property 고정값 정보 검색.
        lt_ua018 = oAPP.DATA.LIB.T_9011.filter( a=> a.CATCD === "UA018");

        //ui object를 다시 매핑처리
        var l_child2 = lf_set_objid(l_child, ls_tree.OBJID, param);

        //붙여넣기정보의 부모를 context menu를 호출한 라인으로 변경 처리.
        l_child2.POBID = ls_tree.OBJID;
        l_child2.PUIOK = ls_tree.UIOBK;


        //context menu를 호출한 라인에 붙여넣기 정보를 추가.
        ls_tree.zTREE.push(l_child2);


        //model 갱신 처리.
        oModel.refresh();

        //붙여넣기한 UI 선택 처리.
        oAPP.fn.setSelectTreeItem(l_child2.OBJID);

        //변경 FLAG 처리.
        oAPP.fn.setChangeFlag();


      } //붙여넣기 callback 이벤트.


      //context menu 호출 라인의 바인딩 정보 얻기.
      var l_bind = this.getBindingContext();

      //해당 라인의 정보 얻기.
      var ls_tree = l_bind.getProperty();

      //DOCUMENT PASTE한경우 EXIT.
      if(ls_tree.OBJID === "ROOT"){
        return;
      }

      //편집 불가능 상태일때는 exit.
      if(!oAPP.attr.oModel.oData.IS_EDIT){
        return;
      }

      //붙여넣기 정보 얻기.
      var l_paste = oAPP.fn.getCopyData('U4AWSuiDesignArea');

      //붙여넣기 정보가 존재하지 않는경우.
      if(!l_paste){
        return;
      }

      var l_child = l_paste[0].DATA;


      //aggregation 선택 팝업 호출.
      if(typeof oAPP.fn.aggrSelectPopup !== "undefined"){

        oAPP.fn.aggrSelectPopup(l_paste[0].DATA, ls_tree, lf_paste_cb);
        return;
      }

      //aggregation 선택 팝업이 존재하지 않는경우 js load후 호출.
      oAPP.fn.getScript("design/js/aggrSelectPopup",function(){
        oAPP.fn.aggrSelectPopup(l_paste[0].DATA, ls_tree, lf_paste_cb);
      });

    }); //paste 메뉴 선택 이벤트



    oLTree1.bindAggregation('items',{path:"/zTREE",template:oLTItem1,parameters:{arrayNames:["zTREE"]}});


  };

})();
