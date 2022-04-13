(function(){
  //우측 페이지(attribute 영역) 구성
  oAPP.fn.uiAttributeArea = function(oRPage){
    
    var oRDynPage = new sap.f.DynamicPage({preserveHeaderStateOnScroll:true});
    oRPage.addContent(oRDynPage);

    var oRDynHead = new sap.f.DynamicPageHeader();
    oRDynPage.setHeader(oRDynHead);


    //우측 attr전체 form.
    var oRFm = new sap.ui.layout.form.Form({editable:true,
      layout: new sap.ui.layout.form.ResponsiveGridLayout({labelSpanL:12,labelSpanM:12,columnsL:1})});
    oRDynHead.addContent(oRFm);

    //우상단 UI명, UI Description 영역
    var oRCtn1 = new sap.ui.layout.form.FormContainer({title:"{/uiinfo/OBJID}",expandable:true});
    oRFm.addFormContainer(oRCtn1);

    var oRElm1 = new sap.ui.layout.form.FormElement({label:new sap.m.Label({text:"Object id",design:"Bold"})});
    oRCtn1.addFormElement(oRElm1);

    //OBJID 입력필드
    var oRInp1 = new sap.m.Input({value:"{/uiinfo/OBJID}",editable:"{/uiinfo/edit01}",
      enabled:"{/IS_EDIT}",valueState:"{/uiinfo/OBJID_stat}",valueStateText:"{/uiinfo/OBJID_stxt}"});
    oRElm1.addField(oRInp1);

    //OBJID를 변경 이벤트.
    oRInp1.attachChange(function(oEvent){
      
      //OBJID 변경건 처리.
      oAPP.fn.attrChnageOBJID();

    }); //OBJID를 변경 이벤트.



    var oRElm2 = new sap.ui.layout.form.FormElement({label:new sap.m.Label({text:"Descriptions",design:"Bold"})});
    oRCtn1.addFormElement(oRElm2);

    //Description 입력 TextArea
    var oRTAr1 = new sap.m.TextArea({width:"100%",rows:4,value:"{/uiinfo/DESC}",editable:"{/uiinfo/edit02}",enabled:"{/IS_EDIT}"});
    oRElm2.addField(oRTAr1);


    //Description 변경 이벤트.
    oRTAr1.attachChange(function(){
      //Description 등록처리.
      oAPP.fn.setDesc(oRInp1.getValue(), this.getValue());

    }); //Description 변경 이벤트.



    var oRElm3 = new sap.ui.layout.form.FormElement({label:new sap.m.Label({text:"UI5 library Reference",design:"Bold"}),visible:"{/uiinfo/vis01}"});
    oRCtn1.addFormElement(oRElm3);

    var oRVB1 = new sap.m.HBox({direction:"Column",renderType:"Bare"});
    oRElm3.addField(oRVB1);

    var oRLk1 = new sap.m.Link({text:"{/uiinfo/UILIB}"});
    oRVB1.addItem(oRLk1);

    var oRLk2 = new sap.m.Link({text:"{/uiinfo/SAMPLE}"});
    oRVB1.addItem(oRLk2);


    //attribute table UI.
    var oRTab1 = new sap.m.Table({mode:"SingleSelectMaster",alternateRowColors:true});
    oRDynPage.setContent(oRTab1);
    oAPP.attr.ui.oRTab1 = oRTab1;

    //table 더블클릭 이벤트 처리.
    oAPP.attr.ui.oRTab1.attachBrowserEvent("dblclick",function(oEvent){
      //table의 더블클릭에 따른 이벤트 처리.
      oAPP.fn.attrDblclickEvent(oEvent);

    });

    //attribute명 컬럼.
    var oRCol1 = new sap.m.Column({width:"30%"});
    oRTab1.addColumn(oRCol1);

    //attribute입력 컬럼
    var oRCol2 = new sap.m.Column();
    oRTab1.addColumn(oRCol2);

    //attribute 첫번째 아이콘(바인딩, 서버 이벤트)
    var oRCol3 = new sap.m.Column({width:"25px",hAlign:"Center"});
    oRTab1.addColumn(oRCol3);

    //attribute 두번째 아이콘(프로퍼티 help, 클라이언트 이벤트)
    var oRCol4 = new sap.m.Column({width:"25px",hAlign:"Center"});
    oRTab1.addColumn(oRCol4);

    //attribute 출력 List Item.
    var oRListItem1 = new sap.m.ColumnListItem();

    //attribute명.
    var oRObjStat1 = new sap.m.ObjectStatus({text:"{UIATT}",icon:"{UIATT_ICON}"});
    oRListItem1.addCell(oRObjStat1);

    //attribute 입력 hbox
    var oRHbox1 = new sap.m.HBox({width:"100%",direction:"Column",renderType:"Bare",alignItems:"Center"});
    oRListItem1.addCell(oRHbox1);

    //attribute 직접입력 필드
    var oRInp2 = new sap.m.Input({value:"{UIATV}",editable:"{edit}",visible:"{inp_visb}",
      showValueHelp:"{showF4}",enabled:"{/IS_EDIT}",valueState:"{valst}",valueStateText:"{valtx}"});
    oRHbox1.addItem(oRInp2);

    //attr 입력필드 이벤트.
    oRInp2.attachChange(function(){

      var ls_attr = this.getBindingContext().getProperty();

      //attribute 입력건 변경처리.
      oAPP.fn.attrChgAttrVal(ls_attr);

    }); //attr 입력필드 이벤트.



    //input f4 help 이벤트
    oRInp2.attachValueHelpRequest(function(oEvent){

      var ls_0015 = this.getBindingContext().getProperty();

      //f4 help 버튼 선택 이벤트.
      oAPP.fn.attrCallValueHelp(oEvent, ls_0015);

    }); //input f4 help 이벤트



    //Attribute DDLB UI
    var oRSel1 = new sap.m.ComboBox({showSecondaryValues:true,width:"100%",selectedKey:"{UIATV}",
      editable:"{edit}",visible:"{sel_visb}",enabled:"{/IS_EDIT}",tooltip:"{UIATV}",
      valueState:"{valst}",valueStateText:"{valtx}"});

    //DDLB 선택 이벤트.
    oRSel1.attachChange(function(){

      var ls_0015 = this.getBindingContext().getProperty();

      //DDLB 선택건이 DOCUMENT의 UI Theme를 변경한건인경우.
      if(ls_0015.UIATK === "DH001021"){
        //미리보기 테마 변경처리.
        oAPP.attr.ui.frame.contentWindow.setPreviewUiTheme(this.getSelectedKey());

      }

      //autoGrowing 프로퍼티 변경건 예외처리.
      if(oAPP.attrChangeAutoGrowingProp(ls_0015) === true){
        return;
      }

      //dropAble 프로퍼티 변경건 예외처리.
      if(oAPP.attrChangeDropAbleProp(ls_0015) === true){
        return;
      }

      //attr 변경처리.
      oAPP.fn.attrChgAttrVal(ls_0015, "DDLB");

      //DDLB 변경 라인 STYLE 처리.
      oAPP.fn.attrSetLineStyle(ls_0015);

      //모델 갱신 처리.
      oAPP.attr.oModel.refresh();

    }); //DDLB 선택 이벤트.


    //DDLB ITEM.
    var oRItm1 = new sap.ui.core.ListItem({key:"{KEY}",text:"{TEXT}",additionalText:"{DESC}"});
    oRSel1.bindAggregation("items",{path:"T_DDLB",template:oRItm1,templateShareable:true});
    oRHbox1.addItem(oRSel1);

    //Attribute Button UI
    var oRBtn1 = new sap.m.Button({icon:"sap-icon://popup-window",width:"100%",type:"Attention",text:"{UIATV}",visible:"{btn_visb}"});
    oRHbox1.addItem(oRBtn1);

    //버튼 선택 이벤트.
    oRBtn1.attachPress(function(oEvent){
      //해당 라인의 바인딩 정보 얻기.
      var ls_0015 = this.getBindingContext().getProperty();

      switch(ls_0015.UIATK){
        case "DH001022":
          //CSS Link Add
          oAPP.fn.fnCssJsLinkAddPopupOpener("CSS");
          break;

        case "DH001023":
          //JS Link Add
          oAPP.fn.fnCssJsLinkAddPopupOpener("JS");
          break;

        case "DH001026":
          //Web Security Settings
          oAPP.fn.fnWebSecurityPopupOpener();
          break;

      }

    }); //버튼 선택 이벤트.



    //Attribute checkbox UI
    var oRChk1 = new sap.m.CheckBox({selected:"{UIATV_c}",editable:"{edit}",visible:"{chk_visb}",
      enabled:"{/IS_EDIT}",valueState:"{valst}"});
    oRHbox1.addItem(oRChk1);


    //체크박스 선택 이벤트
    oRChk1.attachSelect(function(){

      var ls_attr = this.getBindingContext().getProperty();

      //ATTR 변경건 처리.
      oAPP.fn.attrChgAttrVal(ls_attr,"CHECK");

    }); //체크박스 선택 이벤트



    //바인딩(서버 이벤트) 아이콘
    var oRIcon1 = new sap.ui.core.Icon({src:"{icon1_src}",color:"{icon1_color}",visible:"{icon1_visb}"});
    oRListItem1.addCell(oRIcon1);

    //바인딩(서버 이벤트) 아이콘 선택 이벤트
    oRIcon1.attachPress(function(oEvent){

      var ls_attr = this.getBindingContext().getProperty();

      //appcontainer의 AppID 프로퍼티인경우 f4 help 팝업 호출.
      if(oAPP.fn.attrAppf4Popup(ls_attr) === true){
        return;
      }

      //sap.m.Tree, sap.ui.table.TreeTable의 parent, child 프로퍼티 바인딩처리건 점검.
      if(oAPP.fn.attrChkTreeProp(ls_attr) === true){
        return;
      }

      //select option2의 F4HelpID 프로퍼티의 팝업 호출 처리.
      if(oAPP.fn.attrSelOption2F4HelpID(ls_attr) === true){
        return;
      }

      //HTML UI의 content 프로퍼티에 바인딩 처리시 점검.
      if(oAPP.fn.attrChkHTMLContent(ls_attr, true, oAPP.fn.attrBindNEvtPopup) === true){
        return;
      }

      //바인딩 & 이벤트 팝업 호출 처리 function.
      oAPP.fn.attrBindNEvtPopup(ls_attr);

    }); //바인딩(서버 이벤트) 아이콘 선택 이벤트



    //help(script 이벤트) 아이콘
    var oRIcon2 = new sap.ui.core.Icon({src:"{icon2_src}",color:"{icon2_color}",visible:"{icon2_visb}"});
    oRListItem1.addCell(oRIcon2);

    //help(script 이벤트) 아이콘 선택 이벤트
    oRIcon2.attachPress(function(oEvent){
      
      //attribute 라인 정보 얻기.
      var ls_attr = this.getBindingContext().getProperty();

      //선택한 라인이 이벤트인경우.
      if(oAPP.fn.attrClientEventPopup(ls_attr) === true){
        return;
      }

      //sap.ui.core.HTML UI의 content 프로퍼티의 icon선택시 HTML source 팝업 호출.
      if(oAPP.fn.attrHTMLConentPopup(ls_attr) === true){
        return;
      }

      //property help DOCUMENT 팝업 호출.
      if(oAPP.fn.attrPropHelpPopup(ls_attr) === true){
        return;
      }

    }); //help(script 이벤트) 아이콘 선택 이벤트



    //attribute출력 tab에 바인딩 처리.
    oRTab1.bindAggregation("items",{path:"/T_ATTR",template:oRListItem1});

  };  //우측 페이지(attribute 영역) 구성




  /************************************************************************
   * attribute table의 더블클릭에 따른 이벤트 처리.
   * **********************************************************************
   * @param {object} oEvent - dblclick 이벤트 발생시 파라메터.
   ************************************************************************/
  oAPP.fn.attrDblclickEvent = function(oEvent){

    //더블클릭 이벤트 발생 위치의 UI정보 얻기.
    var l_ui = oAPP.fn.getUiInstanceDOM(oEvent.target, sap.ui.getCore());

    //UI INSTANCE를 얻지 못한 경우 EXIT.
    if(!l_ui){return;}

    //바인딩 정보 얻기.
    var l_ctxt = l_ui.getBindingContext();

    //바인딩 정보를 얻지 못한 경우 exit.
    if(!l_ctxt){return;}

    //이벤트 발생 라인의 attribute 정보 얻기.
    var ls_0015 = l_ctxt.getProperty();

    //ATTRIBUTE TYPE에 따른 로직 분기.
    switch(ls_0015.UIATY){
      case "1": //PROPERTY 영역인경우.
        break;

      case "2": //EVENT 영역인경우.
        if(ls_0015.UIATV !== ""){
          //해당 이벤트로 네비게이션 처리.
          oAPP.common.execControllerClass(ls_0015.UIATV);
        }
        break;

      case "3": //AGGREGATION 영역인경우.
        break;

      default:
        return;
    }


  };  //attribute table의 더블클릭에 따른 이벤트 처리.




  /************************************************************************
   * autoGrowing 프로퍼티 변경건에 대한 예외처리.
   * **********************************************************************
   * @param {object} is_attr - 이벤트 발생한 attribute의 라인 정보.
   * @return {boolean} autoGrowing프로퍼티 변경건인경우 function 호출처의
   * 하위로직 skip을 위한 true값 return.
   ************************************************************************/
  oAPP.attrChangeAutoGrowingProp = function(is_attr){

    //autoGrowing 프로퍼티 변경건이 아닌경우 EXIT.
    if(is_attr.UIATK !== "EXT00001347" && is_attr.UIATK !== "EXT00001348" &&
      is_attr.UIATK !== "EXT00001349"){
      return;
    }

    //바인딩 처리된경우 exit.
    if(is_attr.ISBND === "X"){return;}

    //autoGrowing을 true로 설정하지 않은경우 exit.
    if(is_attr.UIATV !== "true"){
      //autoGrowing 프로퍼티 값에 따른 예외처리.
      oAPP.fn.attrSetAutoGrowingException(is_attr, true);
      return;
    }

    var l_msg = "autoGrowing을 설정할 경우 이전에 설정한 서버이벤트 및 클라이언트 이벤트가 초기화 됩니다. " + 
                "진행하시겠습니까?";

    //autoGrowing을 true로 설정한 경우 확인 팝업 호출.
    parent.showMessage(sap, 30, "I", l_msg, function(param){

      //질문 팝업에서 YES를 누르지 않은경우(취소한경우)
      if(param !== "YES"){

        //default false 처리.
        is_attr.UIATV = "false";

        //ATTR 변경건 처리.
        oAPP.fn.attrChgAttrVal(is_attr, "DDLB");

        //모델 갱신 처리.
        oAPP.attr.oModel.refresh();

        return;

      }

      //autoGrowing 프로퍼티 값에 따른 예외처리.
      oAPP.fn.attrSetAutoGrowingException(is_attr, true, true);

      //ATTR 변경건 처리.
      oAPP.fn.attrChgAttrVal(is_attr, "DDLB");

    });

    //function 사용처의 하위로직 skip을 위한 flag return.
    return true;

  };




  /************************************************************************
   * dropAble 프로퍼티 변경건에 대한 예외처리.
   * **********************************************************************
   * @param {object} is_attr - 이벤트 발생한 attribute의 라인 정보.
   * @return {boolean} dropAble프로퍼티 변경건인경우 function 호출처의
   * 하위로직 skip을 위한 true값 return.
   ************************************************************************/
   oAPP.attrChangeDropAbleProp = function(is_attr){

    //dropAble 프로퍼티 변경건이 아닌경우 EXIT.
    if(is_attr.UIASN !== "DROPABLE"){
      return;
    }

    oAPP.fn.attrSetDropAbleException(is_attr, true, true);
    return true;
  };




  /************************************************************************
   * autoGrowing 프로퍼티 값에 따른 예외처리.
   * **********************************************************************
   * @param {object} is_attr - attribute의 라인 정보.
   * @param {boolean} bModelRefresh - 모델 갱신 여부(true : 갱신 처리)
   * @param {boolean} bClear - 대상 이벤트 초기화 여부(true : 초기화함)
   ************************************************************************/
  oAPP.fn.attrSetAutoGrowingException = function(is_attr, bModelRefresh, bClear){

    //입력 ATTRIBUTE 라인 정보가 없는경우.
    if(!is_attr){
      
      //현재 ATTRIBUTE에 출력된 UI정보를 기준으로 autoGrowing 판단 대상건 여부 확인.
      switch (oAPP.attr.oModel.oData.uiinfo.UIOBK) {
        case "UO00326": //sap.m.List
          is_attr = oAPP.attr.oModel.oData.T_ATTR.find( a => a.UIATK === "EXT00001349" );
          break;

        case "UO00447": //sap.m.Table
          is_attr = oAPP.attr.oModel.oData.T_ATTR.find( a => a.UIATK === "EXT00001348" );
          break;

        case "UO01139": //sap.ui.table.Table
          is_attr = oAPP.attr.oModel.oData.T_ATTR.find( a => a.UIATK === "EXT00001347" );
          break;
      
        default:
          //autoGrowing처리 대상 UI가 아닌경우 EXIT.
          return;
      }
    }

    //autoGrowing attribute를 찾지 못한 경우 exit.
    if(!is_attr){return;}

    var lt_UIATK = [];

    //autoGrowing 프로퍼티 KEY에 따른 점검대상 ATTR의 key정보 구성.
    switch(is_attr.UIATK){
      case "EXT00001347": //sap.ui.table.Table의 autoGrowing.        
        //firstVisibleRowChanged
        lt_UIATK = ["AT000013085"];
        break;

      case "EXT00001348": //sap.m.Table의 autoGrowing.
        //growingStarted, growingFinished, updateStarted, updateFinished
        lt_UIATK = ["AT000005916", "AT000005917", "AT000005918", "AT000005919"];
        break;

      case "EXT00001349": //sap.m.List의 autoGrowing.
        //growingStarted, growingFinished, updateStarted, updateFinished
        lt_UIATK = ["AT000003866", "AT000003867", "AT000003868", "AT000003869"];
        break;

      default:
        //autoGrowing이 아닌경우 exit.
        return;

    }
    
    //default 입력 가능 처리.
    var l_edit = true;

    //autoGrowing값이 true인경우.
    if(is_attr.UIATV === "true"){
      //입력 불가 처리.
      l_edit = false;
    }

    //점검대상 event 항목에 대한 처리.
    for(var i=0, l=lt_UIATK.length; i<l; i++){
      //대상 이벤트 검색.
      var ls_attr = oAPP.attr.oModel.oData.T_ATTR.find( a => a.UIATK === lt_UIATK[i] );

      //대상 이벤트를 찾지못한 경우 skip.
      if(typeof ls_attr === "undefined"){continue;}

      //입력 불가 처리.
      ls_attr.edit = l_edit;

      //서버이벤트 아이콘 비활성 처리.
      ls_attr.icon1_visb = l_edit;

      //클라이언트 이벤트 아이콘 비활성 처리.
      ls_attr.icon2_visb = l_edit;

      //초기화 처리가 아닌경우 skip.
      if(bClear !== true){continue}

      //서버이벤트 입력건 초기화.
      ls_attr.UIATV = "";

      //클라이언트 이벤트 SOURCE TYPE 초기화.
      ls_attr.ADDSC = "";

      //클라이언트 수집건 여부 확인 후 삭제.
      oAPP.fn.attrChgAttrVal(ls_attr, "DDLB");

      //UI에 수집되어있는 해당 이벤트 삭제.
      oAPP.fn.attrDelClientEvent(ls_attr);

      //해당 라인의 style 처리.
      oAPP.fn.attrSetLineStyle(ls_attr);

    }

    //모델 갱신처리 flag가 없는경우 exit.
    if(!bModelRefresh){return;}

    //모델 갱신 처리.
    oAPP.attr.oModel.refresh();


  };  //autoGrowing 프로퍼티 값에 따른 예외처리.




  /************************************************************************
   * 클라이언트 이벤트 삭제 처리.
   * **********************************************************************
   * @param {object} is_attr - 이벤트 발생한 attribute의 라인 정보.
   ************************************************************************/
  oAPP.fn.attrDelClientEvent = function(is_attr){

    //수집된 클라이언트 이벤트가 존재하지 않는경우 exit.
    if(oAPP.DATA.APPDATA.T_CEVT.length === 0){return;}

    //클라이언트 이벤트 존재여부 확인.
    var l_index = oAPP.DATA.APPDATA.T_CEVT.findIndex( a => a.OBJID === is_attr.OBJID + is_attr.UIASN && a.OBJTY === "JS" );

    //클라이언트 이벤트가 존재하지 않는경우 EXIT.
    if(l_index === -1){return;}
    
    //클라이언트 이벤트 존재시 해당 라인 삭제 처리.
    oAPP.DATA.APPDATA.T_CEVT.splice(l_index, 1);

  };  //클라이언트 이벤트 삭제 처리.




  /************************************************************************
   * 입력받은 attr 라인의 모델 갱신 처리.
   * **********************************************************************
   * @param {object} is_attr - 이벤트 발생한 attribute의 라인 정보.
   ************************************************************************/
  oAPP.fn.attrSetDropAbleException = function(is_attr, bModelRefresh, bClear){

    //입력 파라메터가 존재하지 않는경우.
    if(typeof is_attr === "undefined"){
      //현재 attr 리스트에서 dropAble 프로퍼티 검색.
      is_attr = oAPP.attr.oModel.oData.T_ATTR.find( a => a.UIASN === "DROPABLE" );

    }

    //attr 파라메터가 존재하지 않는경우 exit.
    if(typeof is_attr === "undefined"){return;}

    //dropAble 프로퍼티 변경건이 아닌경우 exit.
    if(is_attr.UIASN !== "DROPABLE"){return;}

    //default 변경 변경 가능 처리.
    var l_edit = true;

    //dropAble의 값이 false인경우 drop 이벤트 입력 불가 처리.
    if(is_attr.UIATV === "false"){
      l_edit = false;
    }

    if(bClear){      
      //attr 변경건 수집/제거 처리.
      oAPP.fn.attrChgAttrVal(is_attr);

      //해당 라인의 style 처리.
      oAPP.fn.attrSetLineStyle(is_attr);

    }

    //drop 이벤트 라인 찾기.
    var ls_drop = oAPP.attr.oModel.oData.T_ATTR.find( a => a.UIASN === "DNDDROP" );

    if(!ls_drop){return;}

    //drop 이벤트 edit 가능여부 처리.
    ls_drop.edit = l_edit;

    //기존 이벤트 입력건 초기화 여부 FLAG가 존재하는경우, 입력 불가시.
    if(bClear === true && l_edit === false){


      //입력된 이벤트 초기화 처리.
      ls_drop.UIATV = "";

      //클라이언트 이벤트 SOURCE TYPE 초기화.
      ls_drop.ADDSC = "";

      //클라이언트 수집건 여부 확인 후 삭제.
      oAPP.fn.attrChgAttrVal(ls_drop);

      //UI에 수집되어있는 해당 이벤트 삭제.
      oAPP.fn.attrDelClientEvent(ls_drop);

      //해당 라인의 style 처리.
      oAPP.fn.attrSetLineStyle(ls_drop);
      
    }

    if(bModelRefresh){
      oAPP.attr.oModel.refresh();
    }

    return true;

  };




  /************************************************************************
   * 입력받은 attr 라인의 모델 갱신 처리.
   * **********************************************************************
   * @param {object} is_attr - 이벤트 발생한 attribute의 라인 정보.
   ************************************************************************/
  oAPP.fn.attrUpdateLine = function(is_attr){
    
    //입력받은 attribute 항목을 model에서 검색.
    var ls_attr = oAPP.attr.oModel.oData.T_ATTR.find( a=> a.UIATK === is_attr.UIATK );

    //찾지못한 경우 exit.
    if(typeof ls_attr === "undefined"){return;}

    //찾은경우 입력받은 attr을 모델의 해당 라인에 매핑.
    oAPP.fn.moveCorresponding(is_attr, ls_attr);

    //모델 갱신 처리.
    oAPP.attr.oModel.refresh();

  };  //입력받은 attr 라인의 모델 갱신 처리.




  //sap.ui.core.HTML UI의 content 프로퍼티에서 바인딩, editor 호출전 점검.
  oAPP.fn.attrChkHTMLContent = function(is_attr, bFlag, fnCallback){

    //HTML UI의 content 프로퍼티가 아닌경우 exit.
    if(is_attr.UIATK !== "AT000011858"){return;}

    var l_chk = false, l_msg = "";

    //바인딩 팝업전 호출한 경우.
    if(bFlag === true){

      //UI명 + 프로퍼티명으로 OBJID 구성.
      var l_objid = is_attr.OBJID + is_attr.UIASN;

      //HTML editor 입력건 존재여부 확인.
      l_chk = oAPP.DATA.APPDATA.T_CEVT.findIndex( a => a.OBJTY === "HM" && a.OBJID === l_objid) !== -1 ? true : false;

      l_msg = "HTML Editor에 입력한 정보가 존재합니다. 바인딩 처리를 진행하시겠습니까?";

    //HTML editor 팝업전 호출한 경우.
    }else if(bFlag === false){

      //바인딩건이 존재하는경우.
      if(is_attr.ISBND === "X" && is_attr.UIATV !== ""){
        l_chk = true;
      }

      l_msg = "바인딩 정보가 존재합니다. HTML Source 입력처리를 진행하시겠습니까?";

    }

    //확인 불필요상태면 exit.
    if(l_chk !== true){return;}

    //확인이 필요한경우 메시지 팝업 호출.
    parent.showMessage(sap, 30, "I", l_msg, function(param){

    });


  };  //sap.ui.core.HTML UI의 content 프로퍼티에서 바인딩, editor 호출전 점검.




  //sap.ui.core.HTML UI의 content 프로퍼티의 icon선택시 HTML source 팝업 호출.
  oAPP.fn.attrHTMLConentPopup = function(is_attr){

    //HTML UI의 content 프로퍼티가 아닌경우 exit.
    if(is_attr.UIATK !== "AT000011858"){return;}

    //UI명 + 프로퍼티명으로 OBJID 구성.
    var l_objid = is_attr.OBJID + is_attr.UIASN;

    //클라이언트 스크립트 호출 FUNCTION 호출.
    oAPP.fn.fnClientEditorPopupOpener("HM", l_objid,function(param){

      //동일 이벤트 정보 얻기.
      var ls_0015 = oAPP.attr.prev[is_attr.OBJID]._T_0015.find( a=> a.UIATK === is_attr.UIATK);

      if(typeof ls_0015 === "undefined"){
        //수집된건이 없는경우 신규 라인 생성 처리.
        ls_0015 = oAPP.fn.crtStru0015();

        //attribute라인정보 MOVE-CORRESPONDING 처리.
        oAPP.fn.moveCorresponding(is_attr, ls_0015);
        
        ls_0015.APPID = oAPP.attr.appInfo.APPID;
        ls_0015.GUINR = oAPP.attr.appInfo.GUINR;

        oAPP.attr.prev[is_attr.OBJID]._T_0015.push(ls_0015);

      }

      //HTML content 추가됨 flag 구성.
      is_attr.ADDSC = ls_0015.ADDSC = "HM";

      //대상 라인 style 처리..
      //oAPP.fn.attrSetLineStyle(is_attr);

      //default 색상 처리.
      is_attr.icon2_color = "#acaba7";

      //클라이언트 이벤트가 등록된경우.
      if(param === "X"){
        is_attr.icon2_color = "red";

      }

      //모델 갱신 처리.
      oAPP.attr.oModel.refresh();

    });


    //function 사용처의 하위로직 skip을 위한 flag return.
    return true;

  };  //sap.ui.core.HTML UI의 content 프로퍼티의 icon선택시 HTML source 팝업 호출.




  //property help DOCUMENT 팝업 호출.
  oAPP.fn.attrPropHelpPopup = function(is_attr){

    //선택한 라인이 프로퍼티건이 아닌경우 EXIT.
    if(is_attr.UIATY !== "1"){return;}

    //UI5 bootstrap 라이브러리 관리 정보(MIME PATH) 얻기.
    var ls_ua025 = oAPP.DATA.LIB.T_9011.find( a => a.CATCD === "UA025" &&
      a.FLD01 === "APP" && a.FLD06 === "X" );

    if(typeof ls_ua025 === "undefined"){return;}

    //version.
    var l_url = ls_ua025.FLD04 + "?VER=" + ls_ua025.FLD07;

    //ATTRIBUTE의 UI DESIGN 영역 정보 얻기.
    var ls_tree = oAPP.fn.getTreeData(is_attr.OBJID);
    if(typeof ls_tree === "undefined"){return;}

    //UI 라이브러리 명, PROPERTY 구분, 프로퍼티명, UI OBJECT KEY
    l_url = l_url + "&CLSNM=" + ls_tree.UILIB + "&GUBUN=1&PROPID=" + is_attr.UIATT + "&UIOBK=" + is_attr.UIOBK;

    //HELP 팝업 호출.
    fn_PropHelpPopup(l_url);

    //function 사용처의 하위로직 skip을 위한 flag return.
    return true;

  };  //property help DOCUMENT 팝업 호출.


  //client event popup 호출처리.
  oAPP.fn.attrClientEventPopup = function(is_attr){

    //이벤트건이 아닌경우 exit.
    if(is_attr.UIATY !== "2"){return;}

    //OBJID + 이벤트명 대문자 로 client이벤트 script ID 구성.
    var l_objid = is_attr.OBJID + is_attr.UIASN;

    //클라이언트 스크립트 호출 FUNCTION 호출.
    oAPP.fn.fnClientEditorPopupOpener("JS", l_objid,function(param){

      //동일 이벤트 정보 얻기.
      var ls_0015 = oAPP.attr.prev[is_attr.OBJID]._T_0015.find( a=> a.UIATK === is_attr.UIATK);

      if(typeof ls_0015 === "undefined"){
        //수집된건이 없는경우 신규 라인 생성 처리.
        ls_0015 = oAPP.fn.crtStru0015();

        //attribute라인정보 MOVE-CORRESPONDING 처리.
        oAPP.fn.moveCorresponding(is_attr, ls_0015);
        
        ls_0015.APPID = oAPP.attr.appInfo.APPID;
        ls_0015.GUINR = oAPP.attr.appInfo.GUINR;

        oAPP.attr.prev[is_attr.OBJID]._T_0015.push(ls_0015);

      }

      //javascript client event 추가됨 flag 구성.
      is_attr.ADDSC = ls_0015.ADDSC = "JS";

      //해당 라인의 style 처리.
      oAPP.fn.attrSetLineStyle(is_attr);

      //모델 갱신 처리.
      oAPP.attr.oModel.refresh();

    });

    //function 사용처의 하위로직 skip을 위한 flag return.
    return true;

  }; //client event popup 호출처리.




  //DOCUMENT의 F4 HELP 호출 처리.
  oAPP.fn.attrCallValueHelpDOC = function(is_attr){
    
    //DOCUMENT에서 f4 help 호출한건이 아닌경우 exit.
    if(is_attr.OBJID !== "ROOT"){return;}

    //f4 help callback 이벤트.
    function lf_returnDOC(param){

        var l_fldnm = "";
        switch(ls_ua003.ITMCD){
          case "DH001040":  //Code Page
            l_fldnm = "CPATTR";
            break;

          case "DH001100":  //Authorization Group
            l_fldnm = "P_GROUP";
            break;

          defalut:
            return;

        }

        //f4 help에서 선택한 라인의 codepage 정보 매핑.
        is_attr.UIATV = param[l_fldnm];

        //모델 갱신 처리.
        oAPP.attr.oModel.refresh();

        //변경처리 function 수행.
        oAPP.fn.attrChgAttrVal(is_attr);

    }   //f4 help callback 이벤트.



    //코드마스터 DOCUMENT항목의 해당하는 itmcd 정보 얻기.
    var ls_ua003 = oAPP.DATA.LIB.T_9011.find( a => a.CATCD === "UA003" && a.ITMCD === is_attr.UIATK );

    //가능엔트리 항목이 존재하지 않는경우 EXIT.
    if(!ls_ua003 || ls_ua003.FLD05 === ""){
      return;
    }

    //f4 help팝업을 load한경우.
    if(typeof oAPP.fn.callF4HelpPopup !== "undefined"){
      //f4 help 팝업 호출.
      oAPP.fn.callF4HelpPopup(ls_ua003.FLD05,ls_ua003.FLD05,[],[],lf_returnDOC);
      //하위 로직 skip처리를 위한 flag return.
      return true;
    }

    //f4help 팝업을 load하지 못한경우.
    oAPP.fn.getScript("design/js/callF4HelpPopup",function(){
        //f4 help 팝업 function load 이후 팝업 호출.
        oAPP.fn.callF4HelpPopup(ls_ua003.FLD05,ls_ua003.FLD05,[],[],lf_returnDOC);
    });

    //하위 로직 skip처리를 위한 flag return.
    return true;

  };  //DOCUMENT의 F4 HELP 호출 처리.




  //color popup f4 help 호출 처리.
  oAPP.fn.attrCallValueHelpColor = function(oEvent, is_attr){

    //프로퍼티가 아닌경우, 바인딩처리한경우 exit.
    if(is_attr.UIATY !== "1" || is_attr.ISBND === "X"){return;}

    //enum정보가 구성된경우 exit.
    if(typeof is_attr.T_DDLB !== "undefined" && is_attr.T_DDLB.length !== 0){return;}

    var l_UIATT = is_attr.UIATT.toUpperCase();

    //프로퍼티명에 COLOR가 포함안되는경우 exit.
    if(l_UIATT.indexOf("COLOR") === -1){return;}

    jQuery.sap.require("sap.ui.unified.ColorPickerPopover");

    //color picker 팝업 UI생성.
    var oColPic = new sap.ui.unified.ColorPickerPopover();

    //팝업에서 색상 선택 이벤트.
    oColPic.attachChange(function(oEvent){

      //선택 색상 매핑.
      is_attr.UIATV = oEvent.getParameter("hex");

      //모델 갱신 처리.
      oAPP.attr.oModel.refresh();

    });

    //f4 help선택 위치에 color picker 팝업 open처리.
    oColPic.openBy(oEvent.oSource);

    //하위 로직 skip처리를 위한 flag return.
    return true;

  };  //color popup f4 help 호출 처리.




  //icon 선택처리 팝업 호출.
  oAPP.fn.attrCallValueHelpIcon = function(is_attr){

    //icon popup의 callback function.
    function lf_callback(sIcon){
      //전달받은 아이콘명이 존재하지 않는경우 exit.
      if(typeof sIcon === "undefined" || sIcon === null || sIcon === ""){return;}

      //아이콘 매핑.
      is_attr.UIATV = sIcon;

      //모델 갱신 처리.
      oAPP.attr.oModel.refresh();

      //변경값 수집 처리.
      oAPP.fn.attrChgAttrVal(is_attr);

    } //icon popup의 callback function.

    

    //프로퍼티가 아닌경우, 바인딩처리한경우 exit.
    if(is_attr.UIATY !== "1" || is_attr.ISBND === "X"){return;}

    //enum정보가 구성된경우 exit.
    if(typeof is_attr.T_DDLB !== "undefined" && is_attr.T_DDLB.length !== 0){return;}

    var l_UIATT = is_attr.UIATT.toUpperCase();

    //프로퍼티명에 COLOR가 포함안되는경우 exit.
    if(l_UIATT.indexOf("ICON") === -1 && l_UIATT.indexOf("IMAGE") === -1 && l_UIATT.indexOf("SRC") === -1){return;}


    //icon list popup function이 존재하는 경우.
    if(typeof oAPP.fn.callIconListPopup !== "undefined"){
      //icon list popup 호출.
      oAPP.fn.callIconListPopup(lf_callback);
      //하위 로직 skip처리를 위한 flag return.
      return true;
    }

    //icon list popup function이 존재하지 않는 경우.
    oAPP.fn.getScript("design/js/callIconListPopup",function(){
        //icon list popup function load 이후 팝업 호출.
        oAPP.fn.callIconListPopup(lf_callback);
    });


    //하위 로직 skip처리를 위한 flag return.
    return true;


  };  //icon 선택처리 팝업 호출.




  //프로퍼티 f4 help 호출 처리.
  oAPP.fn.attrCallValueHelp = function(oEvent, is_attr){

    //DOCUMENT의 f4 help 호출건인경우 하위 로직 skip.
    if(oAPP.fn.attrCallValueHelpDOC(is_attr) === true){
      return;
    }
  
    //color popup f4 help 호출 처리.
    if(oAPP.fn.attrCallValueHelpColor(oEvent, is_attr) === true){
      return;
    }

    //icon popup 호출 처리.
    if(oAPP.fn.attrCallValueHelpIcon(is_attr) === true){
      return;
    }

      

  };  //프로퍼티 f4 help 호출 처리.




  //OBJID 입력건 처리.
  oAPP.fn.attrChnageOBJID = function(){
    
    ls_uiinfo = oAPP.attr.oModel.getProperty("/uiinfo");

    //대문자 변환 처리.
    ls_uiinfo.OBJID = ls_uiinfo.OBJID.toUpperCase();

    ls_uiinfo.OBJID_stat = "None";
    ls_uiinfo.OBJID_stxt = "";

    var l_sep = "";

    //OBJID의 첫번째 문자가 숫자인경우 오류 처리.
    if(isNaN(ls_uiinfo.OBJID.substr(0,1)) !== true){
      ls_uiinfo.OBJID_stat = "Error";
      ls_uiinfo.OBJID_stxt = "Object ID cannot start with a number.";
      l_sep = "\r\n";
    }

    var reg = /[^A-Z0-9]/;

    //특수문자가 입력된경우 오류 처리.
    if(reg.test(ls_uiinfo.OBJID) === true){
      ls_uiinfo.OBJID_stat = "Error";
      ls_uiinfo.OBJID_stxt = ls_uiinfo.OBJID_stxt + l_sep + "Cannot enter special characters in the object ID.";
      l_sep = "\r\n";
    }

    //동일 OBJID 존재여부 확인.
    if(ls_uiinfo.OBJID !== ls_uiinfo.OBJID_bf){
      
      //tree design영역에 중복된 OBJID건 존재하는경우.
      if(typeof oAPP.fn.getTreeData(ls_uiinfo.OBJID) !== "undefined"){
        ls_uiinfo.OBJID_stat = "Error";
        ls_uiinfo.OBJID_stxt = ls_uiinfo.OBJID_stxt + l_sep + "Duplicate object ID cannot be entered.";
      }
    }

    //오류가 발생한 경우 exit.
    if(ls_uiinfo.OBJID_stat === "Error"){
      oAPP.attr.oModel.setProperty("/uiinfo", ls_uiinfo);
      parent.showMessage(sap, 10, "E", ls_uiinfo.OBJID_stxt);
      return;
    }

    //이전 UI OBJECT에 수집된 ATTR 정보가 존재하는경우.
    if(oAPP.attr.prev[ls_uiinfo.OBJID_bf]._T_0015.length !== 0){
      //ATTR의 OBJECT ID를 변경건으로 매핑.
      for(var i=0, l= oAPP.attr.prev[ls_uiinfo.OBJID_bf]._T_0015.length; i<l; i++){
        oAPP.attr.prev[ls_uiinfo.OBJID_bf]._T_0015[i].OBJID = ls_uiinfo.OBJID;
      }

    }

    //변경된 이름으로 UI 수집 처리.
    oAPP.attr.prev[ls_uiinfo.OBJID] = oAPP.attr.prev[ls_uiinfo.OBJID_bf];

    //이전 이름의 UI 제거.
    delete oAPP.attr.prev[ls_uiinfo.OBJID_bf];

    //DESIGN영역의 변경전 OBJID에 해당하는건 검색.
    var l_tree = oAPP.fn.getTreeData(ls_uiinfo.OBJID_bf);

    //OBJID ID 변경건으로 매핑.
    l_tree.OBJID = ls_uiinfo.OBJID;

    //CHILD 정보가 존재하는 경우.
    if(l_tree.zTREE.length !== 0){
      //CHILD의 부모 OBJECT ID 를 변경 처리.
      for(var i=0,l=l_tree.zTREE.length; i<l; i++){
        l_tree.zTREE[i].POBID = ls_uiinfo.OBJID;
      }
    }

    //클라이언트 이벤트 수집건 objid 변경.
    oAPP.fn.attrChgClientEventOBJID(ls_uiinfo.OBJID, ls_uiinfo.OBJID_bf);

    //desc 입력건 정보 objid 변경.
    oAPP.fn.changeDescOBJID(ls_uiinfo.OBJID, ls_uiinfo.OBJID_bf);

    //이전 OBJID를 변경된 ID로 업데이트.
    ls_uiinfo.OBJID_bf = ls_uiinfo.OBJID;

    //MODEL 갱신 처리.
    oAPP.attr.oModel.setProperty("/uiinfo", ls_uiinfo);
    oAPP.attr.oModel.refresh();

  };  //OBJID 입력건 처리.



  //클라이언트 이벤트의 OBJECT ID 변경 처리.
  oAPP.fn.attrChgClientEventOBJID = function(OBJID, OLDOBJID){
  
    //클라이언트 이벤트가 존재하지 않는경우 exit.
    if(oAPP.DATA.APPDATA.T_CEVT.length === 0){return;}

    //대상 OBJID의 ATTR 변경건이 존재하지 않는경우 EXIT.
    if(oAPP.attr.prev[OBJID]._T_0015.length === 0){return;}

    //이벤트 입력건, sap.ui.core.HTML의 content 프로퍼티 입력건 존재여부 확인.
    lt_attr = oAPP.attr.prev[ls_uiinfo.OBJID]._T_0015.filter( a => a.UIATY === "2" || a.UIATK === "AT000011858" );

    //이벤트, sap.ui.core.HTML의 content프로퍼티 입력건이 존재하지 않는경우 exit.
    if(lt_attr.length === 0){return;}

    for(var i=0, l=lt_attr.length; i<l; i++){

      //이전 OBJECTID로 입력된 클라이언트 이벤트, HTML CONTENT 입력건 존재여부 확인.
      var l_cevt = oAPP.DATA.APPDATA.T_CEVT.find( a=> a.OBJID === OLDOBJID + lt_attr[i].UIASN );

      //존재하지 않는경우 다음건 확인.
      if(typeof l_cevt === "undefined"){continue;}

      //존재하는경우 변경된 OBJECT ID로 매핑 처리.
      l_cevt.OBJID = OBJID + lt_attr[i].UIASN;      

    }

  };



  //바인딩 처리.
  oAPP.fn.attrBindAttr = function(is_attr, is_tree){

    //바인딩 팝업에서 선택한 PATH 정보.
    is_attr.UIATV = is_tree.CHILD;

    //바인딩됨 FLAG 처리.
    is_attr.ISBND = "X";

    //추가속성정의
    is_attr.MPROP = "";

    if(is_attr.UIATY === "1" && is_tree.MPROP !== ""){
      is_attr.MPROP = is_tree.MPROP;
    }

    //이벤트가 아닌경우.
    if(is_attr.UIATY !== "2"){
      //화면 잠금 처리.
      is_attr.edit = false;
    }


    //프로퍼티의 DDLB 항목에서 바인딩 처리한경우.
    if(is_attr.UIATY === "1" && is_attr.T_DDLB){
      //DDLB항목에 바인딩한 정보 추가.
      is_attr.T_DDLB.push({KEY:is_attr.UIATV,TEXT:is_attr.UIATV});
    }

    //해당 라인의 style 처리.
    oAPP.fn.attrSetLineStyle(is_attr);
    
    //dropAble 프로퍼티 입력값 여부에 따른 attr 잠금처리.
    oAPP.fn.attrSetDropAbleException(is_attr);

    //화면 갱신 처리.
    oAPP.attr.oModel.refresh();

    //미리보기 화면 갱신 처리.
    oAPP.fn.previewUIsetProp(is_attr);

    //attr 변경건이 수집됐는지 확인.
    var l_indx = oAPP.attr.prev[is_attr.OBJID]._T_0015.findIndex( a => a.UIATK === is_attr.UIATK && a.UIATY === is_attr.UIATY );

    //수집된건이 존재하는경우.
    if(l_indx !== -1){

      oAPP.attr.prev[is_attr.OBJID]._T_0015[l_indx].UIATV = is_tree.CHILD;
      oAPP.attr.prev[is_attr.OBJID]._T_0015[l_indx].ISBND = "X";
      oAPP.attr.prev[is_attr.OBJID]._T_0015[l_indx].MPROP = "";

      if(is_attr.MPROP !== ""){
        oAPP.attr.prev[is_attr.OBJID]._T_0015[l_indx].MPROP = is_attr.MPROP;
      }

    }else{

      //수집된건이 없는경우 신규 라인 생성 처리.
      var ls_0015 = oAPP.fn.crtStru0015();

      //attribute라인정보 MOVE-CORRESPONDING 처리.
      oAPP.fn.moveCorresponding(is_attr, ls_0015);

      //attr변경건 수집 처리.
      oAPP.attr.prev[is_attr.OBJID]._T_0015.push(is_attr);

    }

    if(is_attr.UIATY === "1"){
      //property에서 바인딩 처리 한 경우.

      //n건 바인딩 처리건인경우 부모 UI에 현재 UI 매핑 처리.
      oAPP.fn.setModelBind(oAPP.attr.prev[is_attr.OBJID]);

    }else if(is_attr.UIATY === "3"){
      //Aggregation에서 바인딩 처리 한 경우.

      //자신 UI에 N건 바인딩 처리함 매핑.
      oAPP.fn.setAggrBind(oAPP.attr.prev[is_attr.OBJID],is_attr.UIATT, is_attr.UIATV);

      //n건 바인딩 처리건인경우 부모 UI에 현재 UI 매핑 처리.
      oAPP.fn.setModelBind(oAPP.attr.prev[is_attr.OBJID]);

    }

    
    //변경 FLAG 처리.
    oAPP.fn.setChangeFlag();


  };  //바인딩 처리.



  //바인딩 팝업 Call Back 이벤트
  oAPP.fn.attrBindCallBack = function(bIsbind, is_tree, is_attr){

    //unbind 처리된경우.
    if(bIsbind === false){
  
      //프로퍼티의 경우 즉시 UNBIND 처리.
      if(is_attr.UIATY === "1"){
        //unbind 처리.
        oAPP.fn.attrUnbindAttr(is_attr);

        return;
      }

      //aggregation의 경우 확인 팝업 호출 후 바인딩 해제 처리.
      if(is_attr.UIATY === "3"){

        parent.showMessage(sap, 30, "I", "하위 바인딩 정보도 초기화 됩니다. 그래도 진행하시겠습니까?", function(param){

          if(param !== "YES"){return;}
          //unbind 처리.
          oAPP.fn.attrUnbindAttr(is_attr);

        });

      }

      return;
      
    }

    //프로퍼티에서 바인딩 처리한경우.
    if(is_attr.UIATY === "1"){
      oAPP.fn.attrBindAttr(is_attr, is_tree);
      return;
    }

    //AGGREGATION에 기존 바인딩건이 존재하지 않는경우.
    if(is_attr.UIATY === "3" && is_attr.UIATV === ""){
      oAPP.fn.attrBindAttr(is_attr, is_tree);
      return;
    }

    //aggregation의 경우 확인 팝업 호출 후 바인딩 해제 처리.
    if(is_attr.UIATY === "3" && is_attr.UIATV !== ""){

      parent.showMessage(sap, 30, "I", "하위 바인딩 정보도 초기화 됩니다. 그래도 진행하시겠습니까?", function(param){
        
        if(param !== "YES"){return;}

        //unbind 처리.
        oAPP.fn.attrUnbindAggr(oAPP.attr.prev[is_attr.OBJID],is_attr.UIATT, is_attr.UIATV);

        oAPP.fn.attrBindAttr(is_attr, is_tree);

      });

      return;

    }    

  }; //바인딩 팝업 Call Back 이벤트




  //n건 바인딩한 프로퍼티 해제 처리.
  oAPP.fn.attrUnbindProp = function(is_attr){

    function lf_findModelBindParent(oParent){

      if(jQuery.isEmptyObject(oParent._BIND_AGGR) === true){
        lf_findModelBindParent(oParent._parent);
        return;
      }

      for(var i in oParent._BIND_AGGR){

        //현재 UI가 N건 바인딩 처리됐는지 확인.
        var l_indx = oParent._BIND_AGGR[i].findIndex( a => a === oAPP.attr.prev[is_attr.OBJID] );

        //N건 바인딩 처리 안된경우 SKIP.
        if(l_indx === -1){continue;}

        //부모의 N건 바인딩 수집건에서 현재 UI 제거 처리.
        oParent._BIND_AGGR[i].splice(0, l_indx);
        return;

      }

      lf_findModelBindParent(oParent._parent);

    }


    lf_findModelBindParent(oAPP.attr.prev[is_attr.OBJID]._parent);


  };  //n건 바인딩한 프로퍼티 해제 처리.




  //바인딩 해제 재귀호출.
  oAPP.fn.attrUnbindAggr = function(oUi, UIATT, UIATV, KEEP_OBJID){
    //n건 바인딩이 없는경우 exit.
    if(!oUi._BIND_AGGR[UIATT] || oUi._BIND_AGGR[UIATT].length === 0){
      return;
    }


    //N건 바인딩 설정한 하위 UI가 존재하는경우.
    for(var i=oUi._BIND_AGGR[UIATT].length-1; i>=0; i--){

      //해당 UI로 파생된 N건 바인딩처리 UI가 존재하는경우.
      if(jQuery.isEmptyObject(oUi._BIND_AGGR[UIATT][i]._BIND_AGGR) !== true){

        //하위를 탐색하며 바인딩 해제 처리.
        for(var j in oUi._BIND_AGGR[UIATT][i]._BIND_AGGR){
          oAPP.fn.attrUnbindAggr(oUi._BIND_AGGR[UIATT][i], j, UIATV, KEEP_OBJID);
        }

        //n건 바인딩 수집건에서 제거 처리.
        oUi._BIND_AGGR[UIATT].splice(i, 1);

        continue;
        
      }

      if(KEEP_OBJID !== oUi._OBJID){
        //현재 UI에 설정된 N건 바인딩 해제 처리.
        for(var j=oUi._BIND_AGGR[UIATT][i]._T_0015.length-1; j>=0; j--){

          //바인딩된건이 아닌경우 SKIP.
          if(oUi._BIND_AGGR[UIATT][i]._T_0015[j].ISBND !== "X"){continue;}

          //바인딩건인경우 N건 바인딩 처리된 건인지 판단.
          if(oAPP.fn.chkBindPath(UIATV, oUi._BIND_AGGR[UIATT][i]._T_0015[j].UIATV) === true){
            //N건 바인딩된 건인경우 바인딩 해제 처리.
            oUi._BIND_AGGR[UIATT][i]._T_0015.splice(j,1);
          }

        }

      }

      //n건 바인딩 수집건에서 제거 처리.
      oUi._BIND_AGGR[UIATT].splice(i, 1);

    }

    if(KEEP_OBJID === oUi._OBJID){return;}

    //현재 UI에 설정된 N건 바인딩 해제 처리.
    for(var i=oUi._T_0015.length-1; i>=0; i--){

      //바인딩된건이 아닌경우 SKIP.
      if(oUi._T_0015[i].ISBND !== "X"){continue;}

      //바인딩건인경우 N건 바인딩 처리된 건인지 판단.
      if(oAPP.fn.chkBindPath(UIATV, oUi._T_0015[i].UIATV) === true){
        //N건 바인딩된 건인경우 바인딩 해제 처리.
        oUi._T_0015.splice(i,1);
      }

    }
    

    if(oAPP.fn.chkBindPath(UIATV, oUi._MODEL[UIATT]) !== true){
      return;
    }

    //Aggregation에 n건 바인딩 처리 제거.
    delete oUi._MODEL[UIATT];

  };  //바인딩 해제 재귀호출.




  //부모를 탐색하며, 현재 UI가 N건 바인딩 처리됐는지 여부 확인.
  oAPP.fn.attrFindBindAggr = function(oUi){

    function lf_chkBindAggr(oParent){

      //최상위에 도달한경우 EXIT.
      if(!oParent){return;}

      //UI의 N건 바인딩 처리건 수집을 확인.
      for(var i in oParent._BIND_AGGR){

        //현재 UI가 N건 바인딩에 수집된경우.
        if(oParent._BIND_AGGR[i].findIndex( a => a === oUi) !== -1){
          //해당 MODEL 바인딩 PATH를 RETURN.
          return {POBID: oParent._OBJID, UIATT:i, UIATV:oParent._MODEL[i]};
        }

      }

      return lf_chkBindAggr(oParent._parent);

    }

    //부모를 탐색하며 N건 바인딩 여부 확인.
    return lf_chkBindAggr(oUi.oParent);


  };  //부모를 탐색하며, 현재 UI가 N건 바인딩 처리됐는지 여부 확인.



  //바인딩 해제 처리 function.
  oAPP.fn.attrUnbindAttr = function(is_attr){
    
    //DDLB로 출력된 프로퍼티의 이전값이 바인딩된 값인경우.
    if(is_attr.UIATY === "1" && is_attr.ISBND === "X" && is_attr.T_DDLB){

      var l_indx = is_attr.T_DDLB.findIndex( a => a.KEY === is_attr.UIATV );

      if(l_indx !== -1){
        //DDLB 항목에서 해당 라인 삭제 처리.
        is_attr.T_DDLB.splice(l_indx, 1);

      }

    }

    //Aggregation에서 unbind처리한 경우 자기 하위 ui를 탐색하면서 n건 바인딩 해제 처리.
    if(is_attr.UIATY === "3"){
      oAPP.fn.attrUnbindAggr(oAPP.attr.prev[is_attr.OBJID],is_attr.UIATT, is_attr.UIATV);
    }

    //이전 정보가 바인딩 처리된건이라면.
    if(is_attr.ISBND === "X" && is_attr.UIATV !== ""){
      //바인딩 정보 초기화.
      is_attr.UIATV = "";

      //일반 프로퍼티의 경우.
      if(is_attr.UIATY === "1"){
        //프로퍼티의 DEFAULT VALUE 검색.
        var ls_0023 = oAPP.DATA.LIB.T_0023.find( a => a.UIATK === is_attr.UIATK );

        //DEFAULT VALUE가 존재하는경우 해당 값 매핑.
        if(ls_0023 && ls_0023.DEFVL !== ""){
          is_attr.UIATV = ls_0023.DEFVL;
        }
      }
      
      //바인딩 FLAG 초기화.
      is_attr.ISBND = "";

      //property의 바인딩 추가속성 정의 초기화.
      is_attr.MPROP = "";

    }


    //Aggregation에서 호출되지 않은경우.
    if(is_attr.UIATY !== "3"){
      //값을 직접 입력 가능 처리.
      is_attr.edit = true;
    }
    

    //attr 변경건 수집 처리.
    oAPP.fn.attrChgAttrVal(is_attr);

    //해당 라인의 style 처리.
    oAPP.fn.attrSetLineStyle(is_attr);

    //dropAble 프로퍼티 입력값 여부에 따른 attr 잠금처리.
    oAPP.fn.attrSetDropAbleException(is_attr,false,true);

    //화면 갱신 처리.
    oAPP.attr.oModel.refresh(true);

    //ATTRIBUTE 영역 갱신 처리.
    oAPP.fn.updateAttrList(is_attr.UIOBK, is_attr.OBJID);


  }; //바인딩 해제 처리 function.




  //프로퍼티의 입력필드 f4 help 설정 여부.
  oAPP.fn.attrSetShowValueHelp = function(is_attr){
    //deflaut f4 help 버튼 비활성 처리.
    is_attr.showF4 = false;

    //PROPERTY가 아닌경우, 바인딩처리된경우 EXIT. 
    if(is_attr.UIATY !== "1" || is_attr.ISBND === "X"){return;}

    //DDLB가 설정된 경우 EXIT.
    if(typeof is_attr.T_DDLB !== "undefined" && is_attr.T_DDLB.length !== 0){return;}

    var l_UIATT = is_attr.UIATT.toUpperCase();

    //프로퍼티명에 COLOR, ICON이 없는경우 EXIT.
    if(l_UIATT.indexOf("COLOR") === -1 && l_UIATT.indexOf("ICON") === -1 && 
      l_UIATT.indexOf("IMAGE") === -1 && l_UIATT.indexOf("SRC") === -1){return;}

    //f4 help 버튼 활성화.
    is_attr.showF4 = true;

  };  //프로퍼티의 입력필드 f4 help 설정 여부.



  //바인딩 & 이벤트 팝업 호출 처리 function.
  oAPP.fn.attrBindNEvtPopup = function(is_attr){

    //event 팝=인경우 display상태인경우 exit.
    if(is_attr.UIATY === "2" && oAPP.attr.oModel.oData.IS_EDIT === false){
      return;
    }

    //Aggregation의 바인딩 팝업 버튼 선택시.
    if(is_attr.UIATY === "3"){

      //현재 ui의 tree 정보 얻기.
      var l_tree = oAPP.fn.getTreeData(is_attr.OBJID);

      //CHILD 정보가 존재하는경우.
      if(l_tree.zTREE.length !== 0){

        //현재 바인딩 아이콘을 선택한 AGGREGATION에 추가된 UI정보 얻기.
        var lt_filter = l_tree.zTREE.filter( a => a.UIATK === is_attr.UIATK);

        //현재 aggregation에 2개 이상의 UI가 추가된경우.
        if(lt_filter.length >= 2){
          parent.showMessage(sap, 10, "E", "If you have one or more child objects, you can not specify a model.");
          return;
        }

      }

    } //Aggregation의 바인딩 팝업 버튼 선택시.


    //이벤트 영역에서 이벤트 발생한 경우.
    if(is_attr.UIATY === "2"){

      //대상 function이 존재하는경우 호출 처리.
      if(typeof oAPP.fn.createEventPopup !== "undefined"){
        oAPP.fn.createEventPopup(is_attr, oAPP.fn.attrCreateEventCallBack);
        return;
      }

      //대상 function이 존재하지 않는경우 script 호출.
      oAPP.fn.getScript("design/js/createEventPopup",function(){
        oAPP.fn.createEventPopup(is_attr, oAPP.fn.attrCreateEventCallBack);
      });

      return;

    }


    var l_title = "", l_CARDI = "";

    switch(is_attr.UIATY){
      case "1": //property
        l_title = "Data Binding / Unbinding - Property";
        l_CARDI = "F";
        break;

        case "3": //Aggregation
        l_title = "Data Binding / Unbinding - Aggregation";
        l_CARDI = "T";
        break;

      default:
        return;

    } //UI Attribute Type에 따른 분기.


    //대상 function이 존재하는경우 호출 처리.
    if(typeof oAPP.fn.callBindPopup !== "undefined"){
      oAPP.fn.callBindPopup(l_title, l_CARDI, oAPP.fn.attrBindCallBack, is_attr.UIATK);
      return;
    }

    //대상 function이 존재하지 않는경우 script 호출.
    oAPP.fn.getScript("design/js/callBindPopup",function(){
      oAPP.fn.callBindPopup(l_title, l_CARDI, oAPP.fn.attrBindCallBack, is_attr.UIATK);
    });

  
  }; //바인딩 & 이벤트 팝업 호출 처리 function.




  //이벤트 팝업 call back 이벤트
  oAPP.fn.attrCreateEventCallBack = function(is_attr, evtnm){

    is_attr.UIATV = evtnm;
    //DDLB항목에 바인딩한 정보 추가.
    //is_attr.T_DDLB.push({KEY:evtnm,TEXT:evtnm});

    //이벤트 추가에 따른 style 처리.
    oAPP.fn.attrSetLineStyle(is_attr);

    //화면 갱신 처리.
    oAPP.attr.oModel.refresh();

    //attr 변경건이 수집됐는지 확인.
    var l_indx = oAPP.attr.prev[is_attr.OBJID]._T_0015.findIndex( a => a.UIATK === is_attr.UIATK );

    //수집된건이 존재하는경우.
    if(l_indx !== -1){

      oAPP.attr.prev[is_attr.OBJID]._T_0015[l_indx].UIATV = evtnm;

    }else{

      //수집된건이 없는경우 신규 라인 생성 처리.
      var ls_0015 = oAPP.fn.crtStru0015();

      //attribute라인정보 MOVE-CORRESPONDING 처리.
      oAPP.fn.moveCorresponding(is_attr, ls_0015);

      //attr변경건 수집 처리.
      oAPP.attr.prev[is_attr.OBJID]._T_0015.push(is_attr);

    }


  }; //이벤트 팝업 call back 이벤트




  //property, event, Aggregation 입력값 처리.
  oAPP.fn.attrChgAttrVal = function(is_attr, uitp){

    //화면에서 UI추가, 이동, 삭제 및 attr 변경시 변경 flag 처리.
    oAPP.fn.setChangeFlag();

    var l_val = is_attr.UIATV;
    var l_dval = "";

    //기존 수집건 존재 여부 확인.
    var l_indx = oAPP.attr.prev[is_attr.OBJID]._T_0015.findIndex( a => a.OBJID === is_attr.OBJID &&
      a.UIATT === is_attr.UIATT && a.UIATY === is_attr.UIATY);

    //이벤트에서 입력값이 변경된경우.
    if(is_attr.UIATY === "2"){

      //이벤트 입력값이 존재하지 않는경우.
      if(is_attr.UIATV === ""){
        
        //수집된건이 없는경우 exit.
        if(l_indx === -1){return;}

        //클라이언트 이벤트 검색.
        var l_cevt = oAPP.DATA.APPDATA.T_CEVT.find( a => a.OBJID === is_attr.OBJID + is_attr.UIASN && a.OBJTY === "JS" );

        //수집건이 존재하는경우 클라이언트 이벤트가 존재시 exit.
        if(l_cevt){return;}

        //수집건존재, 클라이언트 이벤트가 없는경우 해당 라인 삭제 처리.
        oAPP.attr.prev[is_attr.OBJID]._T_0015.splice(l_indx, 1);
        return;

      }

      //서버이벤트 입력값이 존재하는경우.
      if(is_attr.UIATV !== ""){

        //수집건이 존재하는경우.
        if(l_indx !== -1){
          //해당 이벤트 매핑.
          oAPP.attr.prev[is_attr.OBJID]._T_0015[l_indx].UIATV = is_attr.UIATV;
          return;
        }

        //수집건이 존재하지 않는경우 신규 라인 생성 처리.
        var ls_0015 = oAPP.fn.crtStru0015();

        //attr의 입력값 매핑.
        oAPP.fn.moveCorresponding(is_attr, ls_0015);

        //이벤트 입력건 수집 처리.
        ls_0015.APPID = oAPP.attr.appInfo.APPID;
        ls_0015.GUINR = oAPP.attr.appInfo.GUINR;
        oAPP.attr.prev[is_attr.OBJID]._T_0015.push(ls_0015);

      }

      return;

    }

    //checkbox에서 발생한 이벤트인경우.
    if(uitp === "CHECK"){
      //checkbox를 선택한경우 abap_true로, 선택하지 않은경우 abap_false 처리.
      l_val = is_attr.UIATV_c === true ? "X":"";
    }

    //미리보기 화면의 대상 ui의 프로퍼티 변경처리.
    oAPP.fn.previewUIsetProp(is_attr);

    //default 값 얻기.
    if(is_attr.OBJID !== "ROOT" && is_attr.UIATK.indexOf("_1") === -1){
      l_dval = oAPP.DATA.LIB.T_0023.find( a => a.UIATK === is_attr.UIATK ).DEFVL;

    }

    //default 값과 동일한 경우 수집항목이 존재하지 않는경우 exit.
    if(l_dval === l_val && l_indx === -1){
      return;
    }

    //default 값과 동일한 경우 수집항목이 존재하는경우 해당 라인 제거 후 exit.
    if(l_dval === l_val && l_indx !== -1){
      var l_indx = oAPP.attr.prev[is_attr.OBJID]._T_0015.splice(l_indx,1);
      return;
    }

    //입렵값이 default값과 다른경우 수집한 항목이 존재시 해당 라인의 입력값 변경 처리.
    if(l_indx !== -1){
      oAPP.attr.prev[is_attr.OBJID]._T_0015[l_indx].UIATV = l_val;
      return;
    }

    //입력값 default값과 다른경우 해당 라인이 수집되지 않을시 신규라인 생성 처리.
    var ls_0015 = oAPP.fn.crtStru0015();

    oAPP.fn.moveCorresponding(is_attr, ls_0015);

    ls_0015.APPID = oAPP.attr.appInfo.APPID;
    ls_0015.GUINR = oAPP.attr.appInfo.GUINR;

    ls_0015.UIATV = l_val;

    oAPP.attr.prev[is_attr.OBJID]._T_0015.push(ls_0015);

  }; //property, event, Aggregation 입력값 처리.



  //appcontainer 호출 이벤트.
  oAPP.fn.attrAppf4Popup = function(is_attr){
    //appcontainer의 AppID 프로퍼티가 아닌경우 exit.
    if(is_attr.UIATK !== "EXT00000030"){return;}

    //appcontainer callback 이벤트.
    function lf_appCallback(param){
      is_attr.UIATV = param.APPID;

      //AppID 입력값 변경 처리.
      oAPP.fn.attrChgAttrVal(is_attr);

      //AppDescript 프로퍼티 정보 얻기.
      var l_find = oAPP.attr.oModel.oData.T_ATTR.find( a=> a.UIATK === "EXT00000031");
      if(typeof l_find === "undefined"){return;}

      //AppDescript 입력값 변경 처리.
      oAPP.fn.attrChgAttrVal(l_find);

      //model 갱신 처리.
      oAPP.attr.oModel.refresh();

    } //appcontainer callback 이벤트.

    var l_opt = {autoSearch:true, initCond:{PACKG:"", APPID:"", APPNM:"", ERUSR:"", HITS:500}};

    //application f4 help 팝업 호출.
    if (typeof oAPP.fn.fnAppF4PopupOpen !== "undefined") {
        oAPP.fn.fnAppF4PopupOpen(l_opt, lf_appCallback);
        return;
    }

    //js load후 application f4 help 팝업 호출.
    oAPP.loadJs("fnAppF4PopupOpen", function() {
        oAPP.fn.fnAppF4PopupOpen(l_opt, lf_appCallback);
    });

    //하위로직 skip처리를 위한 flag return
    return true;

  };


  //tree의 parent, child 바인딩시 점검.
  oAPP.fn.attrChkTreeProp = function(is_attr){
    var l_UIATK = "";

    //attribute key에 따른 로직 분기.
    switch(is_attr.UIATK){
      case "EXT00001190":   //sap.m.Tree의 parent
      case "EXT00001191":   //sap.m.Tree의 child

        //items Aggregation의 attribute key 매핑.
        l_UIATK = "AT000006260";
        break;

      case "EXT00001192":   //sap.ui.table.TreeTable의 parent
      case "EXT00001193":   //sap.ui.table.TreeTable의 child

        //rows Aggregation의 attribute key 매핑.
        l_UIATK = "AT000013146";
        break;

      default:
        //sap.m.Tree, sap.ui.table.TreeTable의 parent, child 프로퍼티가 아닌경우 exit.
        return false;

    }

    //점검대상 Aggregation 검색.
    var ls_attr = oAPP.attr.oModel.oData.T_ATTR.find( a=> a.UIATK === l_UIATK);

    //해당 Aggregation에 N건 바인딩 처리를 하지 않은경우.
    if(!ls_attr || ls_attr.UIATV === ""){

      is_attr.valst = "Error";
      is_attr.valtx = "Model information does not exist in Aggregation items.";
      oAPP.attr.oModel.refresh();

      //Model information does not exist in Aggregation items.
      parent.showMessage(sap, 20, "E", is_attr.valtx);

      //하위로직 skip처리를 위한 flag return
      return true;

    }

  };




  //select option2의 F4HelpID 프로퍼티의 팝업 호출 처리.
  oAPP.fn.attrSelOption2F4HelpID = function(is_attr){
    
    //selectOption2의 F4HelpID프로퍼티가 아닌경우 exit.
    if(is_attr.UIATK !== "EXT00001188"){return;}
    
    //f4 help callback function.
    function lf_returnDOC(a){

    } //f4 help callback function.

    //f4 help팝업을 load한경우.
    if(typeof oAPP.fn.callF4HelpPopup !== "undefined"){
      //f4 help 팝업 호출.
      oAPP.fn.callF4HelpPopup("DD_SHLP","DD_SHLP",[],[],lf_returnDOC);
      return;
    }

    //f4help 팝업을 load하지 못한경우.
    oAPP.fn.getScript("design/js/callF4HelpPopup",function(){
        //f4 help 팝업 function load 이후 팝업 호출.
        oAPP.fn.callF4HelpPopup("DD_SHLP","DD_SHLP",[],[],lf_returnDOC);
    });

    //하위로직 skip처리를 위한 flag return
    return true;

  };  //select option2의 F4HelpID 프로퍼티의 팝업 호출 처리.




  //visible, editable등의 attribute 처리 전용 바인딩 필드 생성 처리.
  oAPP.fn.attrCreateAttrBindField = function(is_0015){

    //아이콘 활성여부 필드.
    is_0015.icon1_visb = false;  //바인딩(서버이벤트) 아이콘 invisible
    is_0015.icon2_visb = false;  //help(클라이언트이벤트) 아이콘 invisible

    //아이콘 src 필드.
    is_0015.icon1_src = undefined;  //바인딩(서버이벤트) 아이콘 필드
    is_0015.icon2_src = undefined;  //help(클라이언트이벤트) 아이콘 필드

    //아이콘 색상 필드.
    is_0015.icon1_color = undefined;  //바인딩(서버이벤트) 색상 필드
    is_0015.icon2_color = undefined;  //help(클라이언트이벤트) 색상 필드

    //edit 비활성 처리 여부 필드.
    is_0015.edit = false;

    //input의 F4 help 활성여부 필드.
    is_0015.showF4 = false;

    //input(ddlb,checkbox) valueState 필드.
    is_0015.valst = undefined;

    //input(ddlb,checkbox) valueStateText 필드.
    is_0015.valtx = undefined;

    is_0015.btn_icon = undefined; //버튼 아이콘 필드.

    is_0015.UIATT_ICON = undefined; //attribute 아이콘.

    //attribute 표현 UI default 비활성처리 필드.
    is_0015.inp_visb = false; //input invisible
    is_0015.sel_visb = false; //DDLB invisible
    is_0015.chk_visb = false; //checkbox invisible
    is_0015.btn_visb = false; //버튼 invisible

  };  //visible, editable등의 attribute 처리 전용 바인딩 필드 생성 처리.




  //DOCUMENT에 대한 ATTR 정보 구성.
  oAPP.fn.updateDOCAttrList = function(OBJID){

    //코드마스터 기준 DDLB 정보 구성.
    function lf_DDLB(CATCD, USEFLD, KEY, TEXT){

      //코드마스터 기준 DDLB 값 검색.
      if(typeof USEFLD === "undefined"){
        var lt_ITM = oAPP.DATA.LIB.T_9011.filter( a => a.CATCD === CATCD);

      }else{
        var lt_ITM = oAPP.DATA.LIB.T_9011.filter( a => a.CATCD === CATCD && a[USEFLD] === "X");
      }

      var lt_ddlb = [],
          ls_ddlb = {};

      //코드마스터 항목 기준으로 ddlb 항목 구성.
      for(var i=0, l=lt_ITM.length; i<l; i++){

        ls_ddlb.KEY  = lt_ITM[i][KEY];
        ls_ddlb.TEXT = lt_ITM[i][TEXT];
        lt_ddlb.push(ls_ddlb);
        ls_ddlb = {};

      }

      return lt_ddlb;

    } //코드마스터 기준 DDLB 정보 구성.



    //공통코드의 DOCUMENT 구성 정보 검색.
    var lt_ua003 = oAPP.DATA.LIB.T_9011.filter( a => a.CATCD === "UA003" );

    //세팅된 DOCUMENT 정보 검색.
    var lt_0015 = oAPP.attr.prev[OBJID]._T_0015.filter( a => a.OBJID === OBJID );

    //코드마스터의 UI5 Document 속성 정보 기준으로 attributes 정보 구성.
    for(var i=0, l= lt_ua003.length; i<l; i++){

      //신규라인 생성.
      var ls_0015 = oAPP.fn.crtStru0015();

      //attribute 화면제어 필드 생성.
      oAPP.fn.attrCreateAttrBindField(ls_0015);

      //세팅된 DOCUMENT 정보 존재 여부 확인.
      var ls_temp = lt_0015.find( a => a.UIATK === lt_ua003[i].ITMCD );

      //수정불가 값에 따른 EDIT 가능여부 처리.
      if(lt_ua003[i].FLD06 === ""){
        ls_0015.edit = true;
      }

      //f4 help 가능여부에 따른 f4 help 처리.
      if(lt_ua003[i].FLD04 === "X"){
        ls_0015.showF4 = true;
      }

      switch(lt_ua003[i].ITMCD){
        case "DH001021":  //UI Theme
          //DDLB visible 처리.
          ls_0015.sel_visb = true;

          //UI 테마 DDLB 구성.
          ls_0015.T_DDLB = lf_DDLB("UA007", undefined, "FLD01", "FLD01");
          break;

        case "DH001022":  //CSS Link Add
        case "DH001023":  //JS Link Add
        case "DH001026":  //Web Security Settings
          //버튼 visible 처리.
          ls_0015.btn_visb = true;
          break;

        case "DH001105":  //Wait Type
          //DDLB visible 처리.
          ls_0015.sel_visb = true;
          ls_0015.T_DDLB = lf_DDLB("UA034", "FLD03", "FLD01", "FLD02");

          break;

        case "DH001107":  //Touch style
          //DDLB visible 처리.
          ls_0015.sel_visb = true;

          //Touch style DDLB 항목 구성.
          ls_0015.T_DDLB = [{KEY:"",TEXT:""},{KEY:"circle_ripple",TEXT:"원형"}];

          break;

        case "DH001024":  //Init not Loding Waiting
          ls_0015.chk_visb = true;
          break;

        default:
          //기본 input visible 처리.
          ls_0015.inp_visb = true;
          break;
      }

      //존재하는건인경유.
      if(ls_temp){
        oAPP.fn.moveCorresponding(ls_temp, ls_0015);

        //Init not Loding Waiting 항목인경우.
        if(lt_ua003[i].ITMCD === "DH001024"){
          ls_0015.UIATV_c = false;
          if(ls_0015.UIATV === "X"){

            ls_0015.UIATV_c = true;

          }

        }

        oAPP.attr.oModel.oData.T_ATTR.push(ls_0015);

        ls_0015 = {};
        continue;
      }

      ls_0015.APPID = oAPP.attr.appInfo.APPID;
      ls_0015.GUINR = oAPP.attr.appInfo.GUINR;
      ls_0015.UIATK = lt_ua003[i].ITMCD;
      ls_0015.UIATT = lt_ua003[i].FLD01;
      ls_0015.UIATV = "";
      ls_0015.UIATY = "1";
      ls_0015.UIOBK = OBJID;
      ls_0015.OBJID = OBJID;
      ls_0015.UIADT = "string"
      ls_0015.UIASN = ls_0015.UIATT.toUpperCase();

      //Init not Loding Waiting 항목인경우.
      if(lt_ua003[i].ITMCD === "DH001024"){
        ls_0015.UIATV_c = false;
      }


      oAPP.attr.oModel.oData.T_ATTR.push(ls_0015);
      ls_0015 = {};

    } //코드마스터의 UI5 Document 속성 정보 기준으로 attributes 정보 구성.



    oAPP.attr.oModel.refresh(true);

    //attribute 영역 그룹핑 처리.
    oAPP.fn.setAttrModelSort();

  };  //DOCUMENT에 대한 ATTR 정보 구성.



  
  //attribute 항목의 DDLB 정보 구성.
  oAPP.fn.attrSetDDLBList = function(VALKY, UIATY, DEFVL){
    var lt_ddlb = [],
        ls_ddlb = {};

    //attribute가 이벤트건인경우.
    if(UIATY === "2"){
      //서버이벤트 항목 return.
      return oAPP.attr.T_EVT;

    }

    //attribute가 프로퍼티건인경우 enum항목에서 검색.
    var lt_0024 = oAPP.DATA.LIB.T_0024.filter( a => a.VALKY === VALKY);

    //enum 항목에 존재하지 않는경우 return.
    if(lt_0024.length === 0){return [];}

    //default value가 없는경우 ddlb에 빈라인 추가.
    if(DEFVL === ""){
      lt_ddlb.push({KEY:"",TEXT:""});
    }

    //검색한 enum항목을 기준으로 ddlb 항목 구성.
    for(var i=0, l=lt_0024.length; i<l; i++){
      ls_ddlb.KEY = lt_0024[i].VALUE;
      ls_ddlb.TEXT = lt_0024[i].VALUE;
      lt_ddlb.push(ls_ddlb);
      ls_ddlb = {};

    }

    //구성항 DDLB 항목 return
    return lt_ddlb;

  };  //attribute 항목의 DDLB 정보 구성.




  //attr 라인에 따른 style 처리.
  oAPP.fn.attrSetLineStyle = function(is_attr){

    //UI 타입에 따른 로직 분기.
    switch(is_attr.UIATY){
      case "1": //프로퍼티
        //바인딩 아이콘 처리
        is_attr.icon1_src = "sap-icon://fallback";
        is_attr.icon1_color = "#dec066";  //바인딩(서버이벤트) 색상 필드

        //help 아이콘 처리.
        is_attr.icon2_src = "sap-icon://sys-help";
        is_attr.icon2_color = "#40baf3";  //바인딩(서버이벤트) 색상 필드

        //프로퍼티 아이콘 처리.
        is_attr.UIATT_ICON = "sap-icon://customize";

        //프로퍼티에 바인딩 처리된건이 존재하는경우.
        if(is_attr.UIATV !== "" && is_attr.ISBND === "X"){
          is_attr.icon1_color = "yellow";  //바인딩(서버이벤트) 색상 필드
        }

        break;

      case "2": //이벤트
        //서버이벤트 아이콘 처리.
        is_attr.icon1_src = "sap-icon://developer-settings";
        is_attr.icon1_color = "#c9e088";  //바인딩(서버이벤트) 색상 필드

        //서버 이벤트가 존재하는경우.
        if(is_attr.UIATV !== ""){
          is_attr.icon1_color = "blue";  //바인딩(서버이벤트) 색상 필드
        }

        //클라이언트이벤트 아이콘 처리.
        is_attr.icon2_src = "sap-icon://syntax";
        is_attr.icon2_color = "#acaba7";  //바인딩(클라이언트 이벤트) 색상 필드

        //클라이언트 이벤트 검색.
        var l_indx = oAPP.DATA.APPDATA.T_CEVT.findIndex( a => a.OBJID === is_attr.OBJID + is_attr.UIASN && a.OBJTY === "JS" );

        //클라이언트 이벤트가 존재하는경우.
        if(l_indx !== -1){
          is_attr.icon2_color = "red";  //바인딩(클라이언트 이벤트) 색상 필드
        }

        //이벤트 아이콘 처리.
        is_attr.UIATT_ICON = "sap-icon://border";

        break;

      case "3": //Aggregation
        //N개의 UI가 추가되는 Aggregation인경우
        if(is_attr.ISMLB === "X"){
          //바인딩 아이콘 처리
          is_attr.icon1_src = "sap-icon://fallback";
          is_attr.icon1_color = "#dec066";  //바인딩(서버이벤트) 색상 필드
        }

        //help 아이콘 처리.
        is_attr.icon2_src = "sap-icon://warning2";

        //직접 입력 가능한 Aggregation이 아닌경우 ICON 처리.
        if(is_attr.ISSTR !== "X"){
          is_attr.UIATT_ICON = "sap-icon://color-fill";
        }
      
        //Aggregation cardinality 0:N건인경우.
        if(is_attr.ISMLB === "X"){
          //N건 아이콘 처리.
          is_attr.UIATT_ICON = "sap-icon://dimension";
        }

        //AGGREGATION에 바인딩 처리된건이 존재하는경우.
        if(is_attr.UIATV !== ""){
          is_attr.icon1_color = "green";  //바인딩(서버이벤트) 색상 필드
        }

        break;

      default:
        break;

    } //UI 타입에 따른 로직 분기.


  };  //attr 라인에 따른 style 처리.




  //sap.m.UploadCollection, sap.ui.unified.FileUploader UI의 uploadUrl 프로퍼티 예외처리.
  oAPP.fn.attrUploadUrlException = function(OBJID, UIOBK){

    if(UIOBK !== "UO01180" && UIOBK !== "UO00469"){return;}

    var l_UIATK = "";
    switch (UIOBK) {
      case "UO00469": //sap.m.UploadCollection
        l_UIATK = "AT000006316";
        break;

      case "UO01180": //sap.ui.unified.FileUploader
        l_UIATK = "AT000013501";
        break;
    
      default:
        return;

    }

    //uploadUrl 프로퍼티 수집건 존재여부 확인.
    var ls_0015 = oAPP.attr.prev[OBJID]._T_0015.find( a => a.UIATK === l_UIATK );

    //수집건이 존재하는경우.
    if(ls_0015){
      //바인딩 처리된경우 EXIT.
      if(ls_0015.UIATV !== "" && ls_0015.ISBND === "X"){
        return;
      }

      //수집건은 존재하나 값이 존재하지 않는경우.
      if(ls_0015.UIATV === ""){
        ls_0015.UIAT = "/zu4a_srs/" + oAPP.attr.appInfo.APPID.toLocaleLowerCase();
        return;
      }

      //uploadUrl 프로퍼티의 값이 U4A에서 기본 세팅한 값이 아닌경우 EXIT.
      if(ls_0015.UIATV.indexOf("/zu4a_srs/") === -1){
        return;
      }

      // '/zu4a_srs/' + appliciaton id 조합 에서 /zu4a_srs/ 부분을 제외
      var l_appid = ls_0015.UIATV.replace(/\/zu4a_srs\//i, "").toUpperCase();

      //기존의 프로퍼티에 등록한 application id와 현재 application id가 다른경우.
      if(l_appid !== oAPP.attr.appInfo.APPID){
        //현재 application id로 매핑 처리.
        ls_0015.UIAT = "/zu4a_srs/" + oAPP.attr.appInfo.APPID.toLocaleLowerCase();
      }

      return;
    }

    //sap.m.Label의 text property 정보 검색.
    var ls_0023 = oAPP.DATA.LIB.T_0023.find( a=> a.UIATK === l_UIATK );

    ls_0015 = oAPP.fn.crtStru0015();

    oAPP.fn.moveCorresponding(ls_0023, ls_0015);

    var ls_0022 = oAPP.DATA.LIB.T_0022.find( a => a.UIOBK === UIOBK );

    ls_0015.APPID = oAPP.attr.appInfo.APPID;
    ls_0015.GUINR = oAPP.attr.appInfo.GUINR;
    ls_0015.OBJID = OBJID;
    ls_0015.UILIK = ls_0022.UILIK;
    ls_0015.UIATV = "/zu4a_srs/" + oAPP.attr.appInfo.APPID.toLocaleLowerCase();


    //uploadUrl 프로퍼티 수집 처리.
    oAPP.attr.prev[OBJID]._T_0015.push(ls_0015);


  };  //sap.m.UploadCollection, sap.ui.unified.FileUploader UI의 uploadUrl 프로퍼티 예외처리.




  //선택한 UI에 해당하는 attribute 리스트 업데이트 처리.
  oAPP.fn.updateAttrList = function(UIOBK,OBJID){

    oAPP.attr.oModel.oData.T_ATTR = [];

    //DOCUMENT를 선택한 경우.
    if(OBJID === "ROOT"){
      oAPP.fn.updateDOCAttrList(OBJID);
      return;
    }

    //대상 function이 존재하지 않는경우 script 호출.
    if(typeof oAPP.fn.getServerEventList === "undefined"){

      oAPP.fn.getScript("design/js/createEventPopup",function(){
        //서버 이벤트 항목 검색.
        oAPP.fn.getServerEventList();
      },true);

    }else{
      //서버 이벤트 항목 검색.
      oAPP.fn.getServerEventList();

    }

    //file uploader UI의 uploaderUrl 프로퍼티 예외처리.
    oAPP.fn.attrUploadUrlException(OBJID, UIOBK);


    //UI에 해당하는 property, event, Aggregation 정보 얻기.
    var lt_0023 = oAPP.DATA.LIB.T_0023.filter( a => a.UIOBK === UIOBK && a.ISDEP !== "X" && a.UIATY !== "4");

    //얻은 정보 기준으로 attribute 항목 구성.
    for(var i=0, l=lt_0023.length; i<l; i++){

      var ls_0015 = oAPP.fn.crtStru0015();
      oAPP.fn.moveCorresponding(lt_0023[i], ls_0015);

      ls_0015.APPID = oAPP.attr.appInfo.APPID;
      ls_0015.GUINR = oAPP.attr.appInfo.GUINR;
      ls_0015.OBJID = OBJID;
      ls_0015.UIATV = lt_0023[i].DEFVL;

      //visible, editable등의 attribute 처리 전용 바인딩 필드 생성 처리.
      oAPP.fn.attrCreateAttrBindField(ls_0015);

      //아이콘 활성여부 처리.
      ls_0015.bind_visb = true;  //바인딩 아이콘 visible
      ls_0015.help_visb = true;  //help 아이콘 visible


      //input or DDLB 활성여부 처리.
      if(lt_0023[i].ISLST === "X" || ls_0015.UIATY === "2"){
       //DDLB출력건인경우 DDLB visible
        ls_0015.sel_visb = true;

        //DDLB 항목 구성.
        ls_0015.T_DDLB = oAPP.fn.attrSetDDLBList(lt_0023[i].VALKY, ls_0015.UIATY, lt_0023[i].DEFVL);

      }else if(lt_0023[i].ISLST === ""){
        //DDLB출력건이 아닌경우 input visible
        ls_0015.inp_visb = true;

      }

      //Aggregation이 아닌경우 입력필드 입력 가능 처리.
      oAPP.fn.setAttrEditable(ls_0015);
      if(ls_0015.UIATY !== "3"){
        ls_0015.edit = true;
      }

      //DEFAULT 아이콘 활성 처리.
      ls_0015.icon1_visb = true;
      ls_0015.icon2_visb = true;


      oAPP.attr.oModel.oData.T_ATTR.push(ls_0015);

      //직접 입력 가능한 Aggregation이 아닌경우 skip.
      if(lt_0023[i].ISSTR !== "X"){continue;}

      //직접입력 가능한 Aggregation인경우 이전 구조 복사.
      ls_0015 = Object.assign({},ls_0015);

      //직접입력 가능한 Aggregation 키 변경.
      ls_0015.UIATK = ls_0015.UIATK + "_1";
      ls_0015.UIATY = "1";

      ls_0015.edit = true;

      //바인딩 아이콘 처리
      ls_0015.icon1_src = "sap-icon://fallback";
      ls_0015.icon1_color = "#dec066";  //바인딩 색상 필드

      //help 아이콘 처리.
      ls_0015.icon2_src = "sap-icon://sys-help";
      ls_0015.icon2_color = "#40baf3";  //help 색상 필드

      //PROPERTY 아이콘 처리.
      ls_0015.UIATT_ICON = "sap-icon://customize";


      oAPP.attr.oModel.oData.T_ATTR.push(ls_0015);

    } //얻은 정보 기준으로 attribute 항목 구성.

    //embed Aggregation 정보 검색.
    if(OBJID !== "APP"){

      var ls_0015 = oAPP.fn.crtStru0015();
      oAPP.fn.moveCorresponding(oAPP.attr.prev[OBJID]._T_0015.find( a=> a.OBJID === OBJID && a.UIATY === "6"), ls_0015);

      //visible, editable등의 attribute 처리 전용 바인딩 필드 생성 처리.
      oAPP.fn.attrCreateAttrBindField(ls_0015);

      //checkbox visible
      ls_0015.chk_visb = true;

      //체크박스 선택 처리.
      ls_0015.UIATV_c = true;

      //편집 불가 처리.
      ls_0015.edit = false;

      //embed Aggregation 정보 추가.
      oAPP.attr.oModel.oData.T_ATTR.push(ls_0015);

    }

    //대상 UI에 매핑되어있는 프로퍼티, 이벤트 항목에 대한건 ATTRIBUTE영역에 매핑.
    for(var i=0, l=oAPP.attr.oModel.oData.T_ATTR.length; i<l; i++){

      //대상 UI에 해당하는 입력건 검색.
      var ls_0015 = oAPP.attr.prev[OBJID]._T_0015.find( a => a.UIATK === oAPP.attr.oModel.oData.T_ATTR[i].UIATK && 
        a.UIATY === oAPP.attr.oModel.oData.T_ATTR[i].UIATY );

      if(typeof ls_0015 === "undefined"){continue;}

      //입력값 매핑.
      oAPP.attr.oModel.oData.T_ATTR[i].UIATV = ls_0015.UIATV;

      //바인딩처리된경우 하위 로직 수행.
      if(ls_0015.ISBND !== "X" ){continue;}

      //바인딩 구성정보 매핑.
      oAPP.attr.oModel.oData.T_ATTR[i].ISBND = ls_0015.ISBND;
      oAPP.attr.oModel.oData.T_ATTR[i].MPROP = ls_0015.MPROP;

      //입력 비활성 처리.
      oAPP.attr.oModel.oData.T_ATTR[i].edit = false;

      //입력필드 활성화 처리.
      oAPP.attr.oModel.oData.T_ATTR[i].inp_visb = true;

      //checkbox 비활성 처리.
      oAPP.attr.oModel.oData.T_ATTR[i].chk_visb = false;

      //버튼 비활성 처리.
      oAPP.attr.oModel.oData.T_ATTR[i].btn_visb = false;

      //ddlb 비활성 처리.
      oAPP.attr.oModel.oData.T_ATTR[i].sel_visb = false;

    } //대상 UI에 매핑되어있는 프로퍼티, 이벤트 항목에 대한건 ATTRIBUTE영역에 매핑.


    //attr 입력 가능 여부 처리.
    for(var i=0, l=oAPP.attr.oModel.oData.T_ATTR.length; i<l; i++){

      //F4 HELP 버튼 활성여부 처리.
      oAPP.fn.attrSetShowValueHelp(oAPP.attr.oModel.oData.T_ATTR[i]);

      //입력필드 입력 가능여부 처리.
      oAPP.fn.setAttrEditable(oAPP.attr.oModel.oData.T_ATTR[i]);

      //icon 처리.
      oAPP.fn.setExcepAttr(oAPP.attr.oModel.oData.T_ATTR[i]);
      
      //attr 라인에 따른 style 처리.
      oAPP.fn.attrSetLineStyle(oAPP.attr.oModel.oData.T_ATTR[i]);

    }
    
    //autoGrowing 프로퍼티 입력값 여부에 따른 attr 잠금처리.
    oAPP.fn.attrSetAutoGrowingException();

    //dropAble 프로퍼티 입력값 여부에 따른 attr 잠금처리.
    oAPP.fn.attrSetDropAbleException();

    //모델 갱신 처리.
    oAPP.attr.oModel.refresh(true);

    //attribute 영역 그룹핑 처리.
    oAPP.fn.setAttrModelSort();

  };  //선택한 UI에 해당하는 attribute 리스트 업데이트 처리.




  //attribute 영역 그룹핑 처리.
  oAPP.fn.setAttrModelSort = function(){

    var l_bind = oAPP.attr.ui.oRTab1.getBinding("items");

    //attribute 영역 그룹핑 처리.
    l_bind.sort([new sap.ui.model.Sorter("UIATY",false,function(oContext){
      var text, key = oContext.getProperty("UIATY");

      switch(key){
        case "1":
          text = "Property";
          break;

        case "2":
          text = "Event";
          break;

        case "3":
          text = "Aggregation";
          break;

        case "6":
          text = "Embed Aggregation";
          break;
      }

      return {key:key, text:text};

    }),new sap.ui.model.Sorter("UIATK",false)]);

  };  //attribute 영역 그룹핑 처리.




  //UI Info 영역 정보 구성.
  oAPP.fn.setUIInfo = function(is_tree){

    var ls_uiinfo = {};

    //UI명.
    ls_uiinfo.OBJID_bf = ls_uiinfo.OBJID = is_tree.OBJID;

    //UI OBJECT KEY.
    ls_uiinfo.UIOBK = is_tree.UIOBK;

    //DOCUMENT, APP인경우 UI명 변경 불가 처리.
    ls_uiinfo.ENAB01 = true;
    if(is_tree.OBJID === "ROOT" || is_tree.OBJID === "APP"){
      ls_uiinfo.edit01 = false;
    }

    //UI에 해당하는 DESCRIPT 정보.
    ls_uiinfo.DESC = oAPP.fn.getDesc(is_tree.OBJID);

    //UI5 library Reference정보 구성.
    ls_uiinfo.UILIB = is_tree.UILIB;

    ls_uiinfo.vis01 = false;

    //DOCUMENT가 아닌경우(UI인경우)만 UI정보 검색.
    if(is_tree.OBJID !== "ROOT"){

      ls_uiinfo.vis01 = true;

      var ls_0022 = oAPP.DATA.LIB.T_0022.find( a => a.UIOBK === is_tree.UIOBK);

      if(ls_0022.UHREF !== ""){
        ls_uiinfo.SAMPLE = "UI5 library Sample call";
      }
    }

    oAPP.attr.oModel.oData.uiinfo = ls_uiinfo;
    oAPP.attr.oModel.refresh();

  };  //UI Info 영역 정보 구성.




  //UI에 바인딩처리된경우 부모 UI에 해당 정보 매핑.
  oAPP.fn.setModelBind = function(oUi){

    //부모 model 바인딩 정보에 해당 UI 매핑 처리 function.
    function lf_getParentAggrModel(UIATV, EMBED_AGGR, parent){

      if(!parent){return;}

      //대상 Aggregation에 N건 바인딩 처리가 안된경우 상위 부모 탐색.
      if(!parent._MODEL[EMBED_AGGR]){

        //부모가 sap.ui.table.Column인경우 sap.ui.table.Table(TreeTable)의
        //row Aggregation에 N건 바인딩 처리됐는지 여부 판단.
        if(parent.getMetadata()._sClassName === "sap.ui.table.Column"){

          return lf_getParentAggrModel(UIATV, "rows", parent._parent);

        }

        return lf_getParentAggrModel(UIATV, parent._EMBED_AGGR, parent._parent);
      }

      //대상 Aggregation에 N건 바인딩 Path가 다른경우 상위 부모 탐색.
      if(oAPP.fn.chkBindPath(parent._MODEL[EMBED_AGGR], UIATV) !== true){
        return lf_getParentAggrModel(UIATV, parent._EMBED_AGGR, parent._parent);
      }

      //model 정보 수집된건이 없는경우.
      if(!parent._BIND_AGGR[EMBED_AGGR]){
        //구조 생성.
        parent._BIND_AGGR[EMBED_AGGR] = [];
      }

      //이미 model정보가 수집되어있는경우 exit.
      if(parent._BIND_AGGR[EMBED_AGGR].findIndex( a=> a === oUi) !== -1){
        return true;
      }

      //현재 UI 수집처리.
      parent._BIND_AGGR[EMBED_AGGR].push(oUi);
      return true;

    } //부모 model 바인딩 정보에 해당 UI 매핑 처리 function.



    //현재 UI의 property에 바인딩된 정보 얻기.
    var lt_0015 = oUi._T_0015.filter( a => a.ISBND === "X" && a.UIATV !== "" );

    //바인딩된 정보가 존재하지 않는경우 exit.
    if(lt_0015.length === 0){return;}


    //바인딩된 정보를 기준으로 부모를 탐색하며 N건 바인딩 여부 확인.
    for(var i=0,l=lt_0015.length; i<l; i++){

      //N건 바인딩 처리되어 parent에 현재 UI를 추가한 경우 exit.
      if(lf_getParentAggrModel(lt_0015[i].UIATV, oUi._EMBED_AGGR, oUi._parent) === true){
        return;
      }

    }

  };  //UI에 바인딩처리된경우 부모 UI에 해당 정보 매핑.




  //Aggregation에 N건 모델 바인딩 처리시 모델정보 ui에 매핑 처리.
  oAPP.fn.setAggrBind = function(oUI, UIATT, UIATV){

    //모델명, 바인딩 OTAB명이 입력된 경우.
    if(UIATT && UIATV){
      oUI._MODEL[UIATT] = UIATV;
      return;
    }

    if(oUI._T_0015.length === 0){return;}

    //Aggregation에 바인딩처리된 정보 얻기.
    var lt_0015 = oUI._T_0015.filter( a => a.UIATY === "3" && a.ISBND === "X" && a.UIATV !== "" );

    if(lt_0015.length === 0){return;}

    for(var i=0, l=lt_0015.length; i<l; i++){

      oUI._MODEL[lt_0015[i].UIATT] = lt_0015[i].UIATV;

    }

  };  //Aggregation에 N건 모델 바인딩 처리시 모델정보 ui에 매핑 처리.




  //대상 UI로부터 부모를 탐색하며 n건 바인딩 값 얻기.
  oAPP.fn.getParentAggrBind = function(oUI, UIATT){

    if(!oUI){return;}

    if(!oUI._MODEL[UIATT]){

      var l_meta = oUI.getMetadata();

      //sap.ui.table.Column의 template Aggregation에서 부모를 탐색하는경우.
      if(typeof l_meta !== "undefined" &&
         l_meta._sClassName === "sap.ui.table.Column" &&
         typeof oUI._parent !== "undefined" &&
         UIATT === "template"){

        l_meta = oUI._parent.getMetadata();

        //sap.ui.table.Column의 상위 부모가 sap.ui.table.Table이라면.
        if(typeof l_meta !== "undefined" &&
         l_meta._sClassName === "sap.ui.table.Table" ||
         l_meta._sClassName === "sap.ui.table.TreeTable"){

         //rows에 바인딩 처리됐는지 확인.
         return oAPP.fn.getParentAggrBind(oUI._parent, "rows");

        }

      }

      return oAPP.fn.getParentAggrBind(oUI._parent, oUI._EMBED_AGGR);
    }

    //모델에 n건 바인딩이 구성된 경우.
    if(oUI._MODEL[UIATT] !== ""){
      return oUI._MODEL[UIATT];
    }

    return oAPP.fn.getParentAggrBind(oUI._parent, oUI._EMBED_AGGR);

  };  //대상 UI로부터 부모를 탐색하며 n건 바인딩 값 얻기.




  //부모 path로부터 파생된 child path 여부 확인.
  oAPP.fn.chkBindPath = function(parent, child){
    //부모 path를 -로 분리.
    if(typeof parent === "undefined" || parent === ""){return;}
    if(typeof child === "undefined" || child === ""){return;}

    var l_sp1 = parent.split("-");

    //CHILD path를 -로 분리.
    var l_sp2 = child.split("-");

    //부모 path 부분만 남김.
    l_sp2.splice(l_sp1.length);

    //부모 path로부터 파생된 child path인경우.
    if(parent === l_sp2.join("-")){
      //부모 path로부터 파생됨 flag return
      return true;
    }

  };  //부모 path로부터 파생된 child path 여부 확인.




  //Description 세팅.
  oAPP.fn.setDesc = function(OBJID, desc){

    var l_desc = oAPP.DATA.APPDATA.T_DESC.find( a=> a.OBJID === OBJID );

    //존재하지 않는경우.
    if(typeof l_desc === "undefined"){
      //해당 OBJID에 따른 DESCRIPTION 생성 처리.
      l_desc = {};
      l_desc.OBJID = OBJID;
      oAPP.DATA.APPDATA.T_DESC.push(l_desc);

    }

    //DESCRIPTION 초기화.
    l_desc.DESCPT = [];


    //입력 DESCRIPTION의 글자수가 255자 이하인경우.
    if(desc.length <= 255){
      //입력 DESCRIPTION 매핑 후 exit.
      l_desc.DESCPT = [{LINE:desc}];
      return;
    }

    //255자가 넘는경우.
    var l_txt = desc,
        ls_stru= {};

    //255자리씩 끊으며 DESCPT에 수집 처리.
    while(l_txt !== ""){
      ls_stru.LINE = l_txt.substr(0,255);
      l_desc.DESCPT.push(ls_stru);
      ls_stru = {};

      l_txt = l_txt.substr(255);

      if(l_txt === ""){
        return;
      }

    }

  }; //Description 세팅.




  //Description 삭제.
  oAPP.fn.delDesc = function(OBJID){

    //OBJID의 위치 검색.
    var l_indx = oAPP.DATA.APPDATA.T_DESC.findIndex( a=> a.OBJID === OBJID );

    //못찾은경우 EXIT.
    if(l_indx === -1){return;}

    //찾은경우 해당 라인 삭제.
    oAPP.DATA.APPDATA.T_DESC.splice(l_indx,1);


  };  //Description 삭제.




  //Description 검색.
  oAPP.fn.getDesc = function(OBJID){

    var l_desc = oAPP.DATA.APPDATA.T_DESC.find( a=> a.OBJID === OBJID );

    if(typeof l_desc === "undefined"){
      return "";
    }

    var l_txt = "";

    for(var i=0, l=l_desc.DESCPT.length; i<l; i++){
      l_txt += l_desc.DESCPT[i].LINE;
    }

    return l_txt;

  }; //Description 검색.




  //Description 복사.
  oAPP.fn.copyDesc = function(ORG_OBJID, OBJID){

    //원본 OBJID에 해당하는 Description 정보 존재 여부 확인.
    var l_desc = oAPP.fn.getDesc(ORG_OBJID);

    //Description 정보가 존재하지 않는경우 exit.
    if(l_desc === ""){return;}


    //원본 Description을 복사대상건으로 복사 처리.
    oAPP.fn.setDesc(OBJID, l_desc);


  };  //Description 복사.




  //Description의 OBJECT ID 변경 처리.
  oAPP.fn.changeDescOBJID = function(OBJID, OLDOBJID){

    //원본 OBJID에 해당하는 Description 정보 존재 여부 확인.
    var l_desc = oAPP.DATA.APPDATA.T_DESC.find( a=> a.OBJID === OLDOBJID );

    //Description 정보가 존재하지 않는경우 exit.
    if(typeof l_desc === "undefined"){return;}

    //변경하고자 하는 OBJECT ID로 매핑.
    l_desc.OBJID = OBJID;


  };  //Description OBJECT ID 변경 처리.




  // attribute 예외처리
  oAPP.fn.setExcepAttr = function(is_attr, is_0023){

    //appcontainer의 AppID 프로퍼티인경우.
    if(is_attr.UIATK === "EXT00000030"){

      //상세보기 아이콘 처리.
      is_attr.icon1_src = "sap-icon://inspection";
      is_attr.icon2_src = "sap-icon://delete";

      return;
    }


    //appcontainer의 프로퍼티인경우.
    if(is_attr.UIATK === "EXT00000031" ||  //AppDescript
       is_attr.UIATK === "EXT00000032" ||  //height
       is_attr.UIATK === "EXT00000033" ){  //width

       //상세보기 아이콘 처리.
       is_attr.icon1_src = undefined;
       is_attr.icon2_src = undefined;
       is_attr.icon1_visb = false;
       is_attr.icon2_visb = false;
       return;

    }

    //selectOption2의 F4HelpID, F4HelpReturnFIeld 프로퍼티인경우.
    if(is_attr.UIATK === "EXT00001188" ||   //F4HelpID
       is_attr.UIATK === "EXT00001189"){    //F4HelpReturnFIeld

       //상세보기 아이콘 처리.
       is_attr.icon1_src = "sap-icon://inspection";
       is_attr.icon2_src = "sap-icon://delete";

       return;
    }


    //TABLE의 autoGrowing 프로퍼티인경우.
    if(is_attr.UIATK === "EXT00001347" ||   //sap.ui.table.Table autoGrowing
       is_attr.UIATK === "EXT00001348" ||   //sap.m.Table autoGrowing
       is_attr.UIATK === "EXT00001349"){    //sap.m.List autoGrowing

       //상세보기 아이콘 처리.
       is_attr.icon1_src = undefined;
       is_attr.icon2_src = undefined;
       is_attr.icon1_visb = false;
       is_attr.icon2_visb = false;

       return;
    }


    //useBackToTopButton 프로퍼티인경우.
    if(is_attr.UIATK === "EXT00002374" ||   //sap.m.Page useBackToTopButton
       is_attr.UIATK === "EXT00002378" ||   //sap.uxap.ObjectPageLayout useBackToTopButton
       is_attr.UIATK === "EXT00002379"){    //sap.f.DynamicPage

      //상세보기 아이콘 처리.
       is_attr.icon1_src = undefined;
       is_attr.icon2_src = undefined;
       is_attr.icon1_visb = false;
       is_attr.icon2_visb = false;

      return;
    }


    //sap.ui.core.HTML UI의 content 프로퍼티인경우.
    if(is_attr.UIATK === "AT000011858"){

      //help 아이콘 -> 상세 아이콘 처리.
      is_attr.icon2_src = "sap-icon://inspection";

      return;

    }


    //bind 처리된건인경우.
    if(is_attr.ISBND === "X"){

      //바인딩 아이콘 처리
      is_attr.icon1_src = "sap-icon://complete";
      is_attr.icon1_color = "#66ff66";  //바인딩(서버이벤트) 색상 필드

      return;

    }


    //이벤트건인경우.
    if(is_attr.UIATY === "2"){
       //이벤트가 설정되어있다면 아이콘 색상 처리.
       if(is_attr.UIATV !== ""){
        is_attr.icon1_color = "#66ff66";  //바인딩(서버이벤트) 색상 필드
       }

       //클라이언트 이벤트 존재여부 확인.
       var l_find = oAPP.DATA.APPDATA.T_CEVT.find( a=> a.OBJID === is_attr.OBJID + is_attr.UIASN );

       if(typeof l_find !== "undefined"){

         //클라이언트 이벤트 아이콘, 색상 처리.
         is_attr.icon2_src = "sap-icon://syntax";
         is_attr.icon2_color = "#66ff66";  //바인딩(서버이벤트) 색상 필드

       }

    }



  };  // attribute 예외처리



  //attribute 입력 가능 여부 설정.
  oAPP.fn.setAttrEditable = function(is_attr){

    //default 입력 불가 처리.
    is_attr.edit = false;

    //편집 가능 상태가 아닌경우 exit.
    if(oAPP.attr.oModel.oData.IS_EDIT !== true){
      return;
    }

    //Aggregation인경우 exit.
    if(is_attr.UIATY === "3"){
      return;
    }

    //Embed Aggregation인경우 exit.
    if(is_attr.UIATY === "6"){
      return;
    }

    //바인딩 처리가 된경우 exit.
    if(is_attr.ISBND === "X"){
      return;
    }

    //sap.ui.core.HTML UI의 content 프로퍼티인경우 exit.
    if(is_attr.UIATK === "AT000011858"){
      return;
    }


    //selectOption2의 F4HelpID, F4HelpReturnFIeld 프로퍼티인경우.
    if(is_attr.UIATK === "EXT00001188" ||   //F4HelpID
       is_attr.UIATK === "EXT00001189" ||   //F4HelpReturnFIeld
       is_attr.UIATK === "EXT00001161" ){   //value

       return;
    }


    //appcontainer의 AppID 프로퍼티인경우.
    if(is_attr.UIATK === "EXT00000030" || //AppID
       is_attr.UIATK === "EXT00000031" ){ //AppDescript
      return;
    }


    //sap.m.Tree, sap.ui.table.TreeTable의 parent, child 프로퍼티는 입력 불가 처리
    if(is_attr.UIATK === "EXT00001190" ||  //sap.m.Tree의 parent
       is_attr.UIATK === "EXT00001191" ||  //sap.m.Tree의 child
       is_attr.UIATK === "EXT00001192" ||  //sap.ui.table.TreeTable의 parent
       is_attr.UIATK === "EXT00001193" ){  //sap.ui.table.TreeTable의 child
       return;

    }


    //default 입력 가능 처리.
    is_attr.edit = true;

  };




  //ATTRIBUTE FOCUS 처리.
  oAPP.fn.setAttrFocus = function(UIATK, TYPE){
    
    //UI Attribute Internal Key가 입력안된경우 exit.
    if(typeof UIATK === "undefined"){return;}

    //attribute 정보 얻기.
    var lt_item = oAPP.attr.ui.oRTab1.getItems();

    //attribute 정보가 없는경우 exit.
    if(lt_item.length === 0){return;}

    
    for(var i=0, l=lt_item.length; i<l; i++){
      //대상 라인의 바인딩 정보 얻기.
      var l_ctxt = lt_item[i].getBindingContext();
      if(typeof l_ctxt === "undefined"){continue;}

      //UIATK 값 얻기.
      var l_attr = l_ctxt.getProperty();

      //focus 대상 UIATK가 아닌경우 다음건 확인.
      if(l_attr.UIATK !== UIATK){continue;}

      //default value state 처리.
      l_attr.valst = undefined;
      l_attr.valtx = undefined;        

      //type에 따른 value state 처리.
      switch(TYPE){
        case "E":
          l_attr.valst = "Error";
          break;

        case "S":
          l_attr.valst = "Success";
          break;

        case "I":
          l_attr.valst = "Information";
          break;

        case "W":
          l_attr.valst = "Warning";
          break;

        default:
          break;
      }

      //focus 처리대상건인경우 해당 라인 focus 처리.
      oAPP.attr.ui.oRTab1.setSelectedItem(lt_item[i]);

      var l_pos;

      //활성화된 ui에 따른 ui 위치 값 매핑.
      switch(true){
        case l_attr.inp_visb: //input이 활성화된경우.
          l_pos = 0;
          break;

        case l_attr.sel_visb: //ddlb가 활성화된경우.
          l_pos = 1;
          break;

        case l_attr.btn_visb: //button이 활성화된경우.
          l_pos = 2;
          break;

        case l_attr.chk_visb: //checkbox가 활성화된경우.
          l_pos = 3;
          break;

        default:
          return;
      }
      
      //해당 라인의 활성화된 입력필드에 focus 처리.
      lt_item[i].mAggregations.cells[1].mAggregations.items[l_pos].focus();

      break;

    }

    //타입이 존재하지 않는경우 exit.
    if(typeof TYPE === "undefined" || TYPE === ""){return;}

    //타입이 존재하는경우 모델 갱신 처리.
    oAPP.attr.oModel.refresh();

  };  //ATTRIBUTE FOCUS 처리.



  /************************************************************************
   * DOCUMENT 영역의 ATTRIBUTE 갱신 처리.
   * **********************************************************************
   * @param {array} it_attr - document영역의 갱신대상 attribute항목
   * 예) [{"UIATK":"DH001020","UIATV":"00003"},...]
   ************************************************************************/
  oAPP.fn.attrUpdateDocAttr = function(it_attr){

    //갱신처리 attribute 정보가 존재하지 않는경우 exit.
    if(it_attr.length === 0){return;}

    //갱신처리 대상건을 기준으로 ROOT에 수집된 attribute 갱신처리.
    for(var i=0, l=it_attr.length; i<l; i++){

      switch(it_attr[i].UIATK){
        case "DH001020":  //Web Application Version
          oAPP.attr.appInfo.APPVR = it_attr[i].UIATV;
          break;

        case "DH001025":  //Request/Task
          oAPP.attr.appInfo.REQNR = it_attr[i].UIATV;
          oAPP.attr.appInfo.REQNO = it_attr[i].UIATV;
          break;

        case "DH001140":  //Change User
          oAPP.attr.appInfo.AEUSR = it_attr[i].UIATV;
          break;

        case "DH001150":  //Change Date
          oAPP.attr.appInfo.AEDAT = it_attr[i].UIATV;
          break;

        case "DH001160":  //Change Time
          oAPP.attr.appInfo.AETIM = it_attr[i].UIATV;
          break;
      }

      //기존에 수집되어있는 ATTRIBUTE항목 확인.
      var ls_attr = oAPP.attr.prev.ROOT._T_0015.find( a=> a.UIATK === it_attr[i].UIATK );

      //기존 수집 항목의 값을 갱신 처리.
      if(ls_attr){
        ls_attr.UIATV = it_attr[i].UIATV;
        continue;
      }

      //기존에 수집된 항목에 존재하지 않는경우 코드마스터에서 document attr정보 얻기.
      var ls_ua003 = oAPP.DATA.LIB.T_9011.find( a => a.CATCD === "UA003" && a.ITMCD === it_attr[i].UIATK );
      
      //코드마스터에 존재하지 않는경우 skip.
      if(!ls_ua003){continue;}

      //기존에 수집된 항목에 존재하지 않는경우 신규 라인 생성 처리.
      ls_attr = oAPP.fn.crtStru0015();      

      ls_attr.APPID = oAPP.attr.appInfo.APPID;
      ls_attr.GUINR = oAPP.attr.appInfo.GUINR;
      ls_attr.OBJID = "ROOT";
      ls_attr.UIATK = it_attr[i].UIATK;
      ls_attr.UIATV = it_attr[i].UIATV;
      ls_attr.UIOBK = "ROOT";
      ls_attr.UIATT = ls_ua003.FLD01;
      ls_attr.UIASN = ls_attr.UIATT.toUpperCase();
      ls_attr.UIASN = ls_attr.UIASN.substr(0,18);
      ls_attr.UIADT = "string";
      ls_attr.UIATY = "1";
      oAPP.attr.prev.ROOT._T_0015.push(ls_attr);

    }

    //현재 선택한 TREE가 ROOT가 아닌경우 EXIT.
    if(oAPP.attr.oModel.oData.uiinfo.OBJID !== "ROOT"){return;}

    //갱신처리 대상건을 기준으로 ATTRIBUTE 영역의 출력정보 갱신 처리.
    for(var i=0, l=it_attr.length; i<l; i++){
      
      //대상 ATTRIBUTE 라인 얻기.
      var ls_attr = oAPP.attr.oModel.oData.T_ATTR.find( a => a.UIATK === it_attr[i].UIATK );
      
      //해당 라인을 얻지못한 경우 SKIP.
      if(!ls_attr){continue;}

      //갱신값 매핑.
      ls_attr.UIATV = it_attr[i].UIATV;

    }

    //모델 갱신 처리.
    oAPP.attr.oModel.refresh();


  };  //DOCUMENT 영역의 ATTRIBUTE 갱신 처리.



})();
