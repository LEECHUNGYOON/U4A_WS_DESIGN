(function(){
  //우측 페이지(attribute 영역) 구성
  oAPP.fn.uiAttributeArea = function(oRPage){

    //property, event, Aggregation 입력값 처리.
    function lf_chgAttrVal(is_attr, uitp){

      //화면에서 UI추가, 이동, 삭제 및 attr 변경시 변경 flag 처리.
      oAPP.fn.setChangeFlag();

      var l_val = is_attr.UIATV;
      var l_dval = "";

      //checkbox에서 발생한 이벤트인경우.
      if(uitp === "CHECK"){
        //checkbox를 선택한경우 abap_true로, 선택하지 않은경우 abap_false 처리.
        l_val = is_attr.UIATV_c === true ? "X":"";
      }

      //미리보기 화면의 대상 ui의 프로퍼티 변경처리.
      oAPP.fn.previewUIsetProp(is_attr);

      //default 값 얻기.
      if(is_attr.OBJID !== "ROOT"){
        l_dval = oAPP.DATA.LIB.T_0023.find( a => a.UIATK === is_attr.UIATK ).DEFVL;

      }

      //프로퍼티 입력건 수집 항목에 현재 UI의 프로퍼티가 수집됐는지 확인.
      var l_indx = oAPP.attr.prev[is_attr.OBJID]._T_0015.findIndex( a => a.OBJID === is_attr.OBJID && a.UIATT === is_attr.UIATT);

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

    } //property, event, Aggregation 입력값 처리.



    //바인딩 & 이벤트 팝업 호출 처리 function.
    function lf_bindNEvtPopup(oEvent){

      var l_ctxt = oEvent.oSource.getBindingContext();
      if(!l_ctxt){return;}

      var ls_attr = l_ctxt.getProperty();
      if(!ls_attr){return;}

      //Aggregation의 바인딩 팝업 버튼 선택시.
      if(ls_attr.UIATY === "3"){

        var l_agrnm = oAPP.fn.getUIAttrFuncName(oAPP.attr.prev[ls_attr.OBJID], ls_attr.UIATY,ls_attr.UIATT,'_sGetter');

        //n건 바인딩시 Aggregation에 UI가 1개만 존재해야함.
        if(oAPP.attr.prev[ls_attr.OBJID][l_agrnm]().length > 2){
          parent.showMessage(sap, 10, 'E', 'If you have one or more child objects, you can not specify a model.');
          return;
        }

      } //바인딩 & 이벤트 팝업 호출 처리 function.



      var l_func = "",l_title = "",f_callback;

      //UI Attribute Type에 따른 분기.
      switch(ls_attr.UIATY){
        case "1": //property
          l_func = 'callBindPopup';
          l_title = 'Property';
          f_callback = lf_bindCallBack;
          break;

        case "2": //event
          l_func = 'createEventPopup';
          f_callback = lf_eventCallBack;
          break;

        case "3": //Aggregation
          l_func = 'callBindPopup';
          l_title = 'Aggregation';
          f_callback = lf_bindCallBack;
          break;

        default:
          return;

      } //UI Attribute Type에 따른 분기.

      //대상 function이 존재하는경우 호출 처리.
      if(typeof oAPP.fn[l_func] !== "undefined"){
        oAPP.fn[l_func](l_title, ls_attr, f_callback);
        return;
      }

      //대상 function이 존재하지 않는경우 script 호출.
      oAPP.fn.getScript(l_func,function(){
        oAPP.fn[l_func](l_title, ls_attr, f_callback);
      });

    } //바인딩 & 이벤트 팝업 호출 처리 function.



    //이벤트 팝업 call back 이벤트
    function lf_eventCallBack(is_attr, evtnm){

      is_attr.UIATV = evtnm;
      //DDLB항목에 바인딩한 정보 추가.
      //is_attr.T_DDLB.push({KEY:evtnm,TEXT:evtnm});

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

    } //이벤트 팝업 call back 이벤트



    //바인딩 팝업 Call Back 이벤트
    function lf_bindCallBack(is_tree,is_attr,is_unbind){

      //unbind 처리된경우.
      if(is_unbind === true){
        lf_unbindAttr(is_attr);
        return;
      }

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

      //화면 갱신 처리.
      oAPP.attr.oModel.refresh();

      //미리보기 화면 갱신 처리.
      oAPP.fn.previewUIsetProp(is_attr);

      //attr 변경건이 수집됐는지 확인.
      var l_indx = oAPP.attr.prev[is_attr.OBJID]._T_0015.findIndex( a => a.UIATK === is_attr.UIATK );

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
      }

    } //바인딩 팝업 Call Back 이벤트



    //바인딩 해제 처리 function.
    function lf_unbindAttr(is_attr){

      //바인딩 해제 재귀호출.
      function lf_unbindAttrRec(oUI, UIATT){

        //n건 바인딩이 없는경우 exit.
        if(oUI._BIND_AGGR[UIATT].length === 0){
          return;
        }


        //N건 바인딩 설정한 하위 UI가 존재하는경우.
        for(var i=0, l=oUI._BIND_AGGR[UIATT].length; i<l; i++){

          //해당 UI로 파생된 N건 바인딩처리 UI가 존재하는경우.
          if(jQuery.isEmptyObject(oUI._BIND_AGGR[UIATT][i]._BIND_AGGR) !== true){

            //하위를 탐색하며 바인딩 해제 처리.
            for(var j in oUI._BIND_AGGR[UIATT][i]._BIND_AGGR){
              lf_unbindAttrRec(oUI._BIND_AGGR[UIATT][i], j);
            }
            continue;
          }

          //현재 UI에 설정된 N건 바인딩 해제 처리.
          for(var j=oUI._BIND_AGGR[UIATT][i]._T_0015.length-1; j>=0; j--){

            //바인딩된건이 아닌경우 SKIP.
            if(oUI._BIND_AGGR[UIATT][i]._T_0015[j].ISBND !== "X"){continue;}

            //바인딩건인경우 N건 바인딩 처리된 건인지 판단.
            if(oAPP.fn.chkBindPath(is_attr.UIATV, oUI._BIND_AGGR[UIATT][i]._T_0015[j].UIATV) === true){
              //N건 바인딩된 건인경우 바인딩 해제 처리.
              oUI._BIND_AGGR[UIATT][i]._T_0015.splice(j,1);
            }

          }

        }

        //현재 UI에 설정된 N건 바인딩 해제 처리.
        for(var i=oUI._T_0015.length-1; i>=0; i--){

          //바인딩된건이 아닌경우 SKIP.
          if(oUI._T_0015[i].ISBND !== "X"){continue;}

          //바인딩건인경우 N건 바인딩 처리된 건인지 판단.
          if(oAPP.fn.chkBindPath(is_attr.UIATV, oUI._T_0015[i].UIATV) === true){
            //N건 바인딩된 건인경우 바인딩 해제 처리.
            oUI._T_0015.splice(i,1);
          }

        }

        if(oAPP.fn.chkBindPath(is_attr.UIATV, oUI._MODEL[UIATT]) !== true){
          return;
        }

        //Aggregation에 n건 바인딩 처리 제거.
        delete oUI._MODEL[UIATT];

      } //바인딩 해제 재귀호출.



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
        lf_unbindAttrRec(oAPP.attr.prev[is_attr.OBJID],is_attr.UIATT);
      }

      is_attr.UIATV = "";

      //property 바인딩 해제건인경우.
      if(is_attr.UIATY === "1" && is_attr.UIATK.substr(3) !== "EXT"){
        //해당 property의 default 값 매핑.
        is_attr.UIATV = oAPP.attr.prev[is_attr.OBJID].mProperties[is_attr.UIATT];
      }


      //Aggregation에서 호출되지 않은경우.
      if(is_attr.UIATY !== "3"){
        //값을 직접 입력 가능 처리.
        is_attr.edit = true;
      }

      //바인딩 FLAG 초기화.
      is_attr.ISBND = "";

      //property의 바인딩 추가속성 정의 초기화.
      is_attr.MPROP = "";

      //attr 변경건이 수집됐는지 확인.
      var l_indx = oAPP.attr.prev[is_attr.OBJID]._T_0015.findIndex( a => a.UIATK === is_attr.UIATK );

      //수집된건이 존재하는경우.
      if(l_indx !== -1){
        //수집된건 제거 처리.
        oAPP.attr.prev[is_attr.OBJID]._T_0015.splice(l_indx, 1);
      }

      //화면 갱신 처리.
      oAPP.attr.oModel.refresh();

      //미리보기 화면 갱신 처리.
      oAPP.fn.previewUIsetProp(is_attr);

      //ATTRIBUTE 영역 갱신 처리.
      oAPP.fn.updateAttrList(is_attr.UIOBK, is_attr.OBJID);


    } //바인딩 해제 처리 function.




    var oRFm = new sap.ui.layout.form.Form({editable:true,
      layout: new sap.ui.layout.form.ResponsiveGridLayout({labelSpanL:12,labelSpanM:12,columnsL:1})});
    oRPage.addContent(oRFm);

    //우상단 UI명, UI Description 영역
    var oRCtn1 = new sap.ui.layout.form.FormContainer({title:"UI Info",expandable:true});
    oRFm.addFormContainer(oRCtn1);

    var oRElm1 = new sap.ui.layout.form.FormElement({label:new sap.m.Label({text:"Object id",design:"Bold"})});
    oRCtn1.addFormElement(oRElm1);

    //OBJID 입력필드
    var oRInp1 = new sap.m.Input({value:"{/uiinfo/OBJID}",editable:"{/uiinfo/edit01}",
      enabled:"{/IS_EDIT}",valueState:"{/uiinfo/OBJID_stat}",valueStateText:"{/uiinfo/OBJID_stxt}"});
    oRElm1.addField(oRInp1);

    //OBJID를 변경 이벤트.
    oRInp1.attachChange(function(oEvent){

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
      }

      //동일 OBJID 존재여부 확인.
      if(ls_uiinfo.OBJID !== ls_uiinfo.OBJID_bf){
        var l_indx = oAPP.attr.oModel.oData.TREE.findIndex( a=> a.OBJID === ls_uiinfo.OBJID);

        //동일 OBJID를 입력한 경우.
        if(l_indx !== -1){
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

      //OBJID에 해당하는건 검색.
      var l_tree = oAPP.attr.oModel.oData.TREE.find( a => a.OBJID === ls_uiinfo.OBJID_bf );

      //OBJID ID 변경건으로 매핑.
      l_tree.OBJID = ls_uiinfo.OBJID;

      //해당 UI의 CHILD UI 정보 얻기.
      var lt_child = oAPP.attr.oModel.oData.TREE.filter( a => a.POBID === ls_uiinfo.OBJID_bf );

      //CHILD 정보가 존재하는 경우.
      if(lt_child.length !== 0){
        //CHILD의 부모 OBJECT ID 를 변경 처리.
        for(var i=0,l=lt_child.length; i<l; i++){
          lt_child[i].POBID = ls_uiinfo.OBJID;
        }
      }


      //UI 디자인 영역의 선택 라인 정보 얻기.
      l_tree = oAPP.attr.oModel.getObject(ls_uiinfo.treePath);

      //OBJID ID 변경건으로 매핑.
      l_tree.OBJID = ls_uiinfo.OBJID;

      //design 영역의 CHILD 정보가 존재하는 경우.
      if(l_tree.zTREE.length !== 0){
        //CHILD의 부모 OBJECT ID 를 변경 처리.
        for(var i=0,l=l_tree.zTREE.length; i<l; i++){
          l_tree.zTREE[i].POBID = ls_uiinfo.OBJID;
        }
      }

      //이전 OBJID를 변경된 ID로 업데이트.
      ls_uiinfo.OBJID_bf = ls_uiinfo.OBJID;

      oAPP.attr.oModel.setProperty("/uiinfo", ls_uiinfo);
      oAPP.attr.oModel.refresh();


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


    //attribute 영역
    var oRCtn2 = new sap.ui.layout.form.FormContainer({title:"Attributes"});
    oRFm.addFormContainer(oRCtn2);

    var oRElm3 = new sap.ui.layout.form.FormElement();
    oRCtn2.addFormElement(oRElm3);

    var oRTab1 = new sap.m.Table({mode:"None",alternateRowColors:true});
    oRElm3.addField(oRTab1);
    oAPP.attr.oRTab1 = oRTab1;

    var oRCol1 = new sap.m.Column({width:"30%"});
    oRTab1.addColumn(oRCol1);

    var oRCol2 = new sap.m.Column();
    oRTab1.addColumn(oRCol2);

    var oRCol3 = new sap.m.Column({width:"25px",hAlign:"Center"});
    oRTab1.addColumn(oRCol3);

    var oRCol4 = new sap.m.Column({width:"25px",hAlign:"Center"});
    oRTab1.addColumn(oRCol4);


    var oRListItem1 = new sap.m.ColumnListItem();

    var oRObjStat1 = new sap.m.ObjectStatus({text:"{UIATT}",icon:"{UIATT_ICON}"});
    oRListItem1.addCell(oRObjStat1);

    var oRHbox1 = new sap.m.HBox({width:"100%",direction:"Column",renderType:"Bare",alignItems:"Center"});
    oRListItem1.addCell(oRHbox1);

    var oRInp2 = new sap.m.Input({value:"{UIATV}",editable:"{edit}",visible:"{inp_visb}",
      showValueHelp:"{showF4}",enabled:"{/IS_EDIT}",valueState:"{valst}",valueStateText:"{valtx}"});
    oRHbox1.addItem(oRInp2);

    //attr 입력필드 이벤트.
    oRInp2.attachChange(function(){

      var ls_attr = this.getBindingContext().getProperty();

      lf_chgAttrVal(ls_attr);

    }); //attr 입력필드 이벤트.



    //input f4 help 이벤트
    oRInp2.attachValueHelpRequest(function(){

      //f4 help callback 이벤트.
      function lf_returnDOC(param){
        debugger;
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
          that.setValue(param[l_fldnm]);

          //변경처리 function 수행.
          lf_chgAttrVal(ls_0015);

      }   //f4 help callback 이벤트.



      var ls_0015 = this.getBindingContext().getProperty();


      //ROOT항목이 아닌경우.
      if(ls_0015.OBJID !== "ROOT"){
        return;
      }


      //ROOT의 attrubite항목중 f4 help를 선택한 경우.

      //코드마스터 DOCUMENT항목의 해당하는 itmcd 정보 얻기.
      var ls_ua003 = oAPP.DATA.LIB.T_9011.find( a => a.CATCD === "UA003" && a.ITMCD === ls_0015.UIATK );

      //가능엔트리 항목이 존재하지 않는경우 EXIT.
      if(!ls_ua003 || ls_ua003.FLD05 === ""){
        return;

      }

      var that = this;


      //f4 help팝업을 load한경우.
      if(typeof oAPP.fn.callF4HelpPopup !== "undefined"){
        //f4 help 팝업 호출.
        oAPP.fn.callF4HelpPopup(ls_ua003.FLD05,ls_ua003.FLD05,[],[],lf_returnDOC);
        return;
      }

      //f4help 팝업을 load하지 못한경우.
      oAPP.fn.getScript("callF4HelpPopup",function(){
          //f4 help 팝업 function load 이후 팝업 호출.
          oAPP.fn.callF4HelpPopup(ls_ua003.FLD05,ls_ua003.FLD05,[],[],lf_returnDOC);
      });

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

      lf_chgAttrVal(ls_0015, "DDLB");

    }); //DDLB 선택 이벤트.



    var oRItm1 = new sap.ui.core.ListItem({key:"{KEY}",text:"{TEXT}",additionalText:"{DESC}"});
    oRSel1.bindAggregation('items',{path:"T_DDLB",template:oRItm1,templateShareable:true});

    oRHbox1.addItem(oRSel1);

    //Attribute Button UI
    var oRBtn1 = new sap.m.Button({icon:"sap-icon://popup-window",width:"100%",type:"Attention",text:"{UIATV}",visible:"{btn_visb}"});
    oRHbox1.addItem(oRBtn1);

    //버튼 선택 이벤트.
    oRBtn1.attachPress(function(oEvent){
      //해당 라인의 바인딩 정보 얻기.
      var l_ctxt = this.getBindingContext();
      if(!l_ctxt){return;}

      var ls_0015 = oAPP.attr.oModel.getProperty(l_ctxt.getPath());

      switch(ls_0015.UIATT){

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
      lf_chgAttrVal(ls_attr,"CHECK");

    }); //체크박스 선택 이벤트



    //바인딩(서버 이벤트) 아이콘
    var oRIcon1 = new sap.ui.core.Icon({src:"{icon1_src}",color:"{icon1_color}"});

    //바인딩(서버 이벤트) 아이콘 선택 이벤트
    oRIcon1.attachPress(function(oEvent){

      //appcontainer callback 이벤트.
      function lf_appCallback(param){
        l_attr.UIATV = param.APPID;

        //AppID 입력값 변경 처리.
        lf_chgAttrVal(l_attr);

        //AppDescript 프로퍼티 정보 얻기.
        var l_find = oAPP.attr.oModel.oData.T_ATTR.find( a=> a.UIATK === "EXT00000031");
        if(typeof l_find === "undefined"){return;}

        //AppDescript 입력값 변경 처리.
        lf_chgAttrVal(l_find);

        //model 갱신 처리.
        oAPP.attr.oModel.refresh();

      } //appcontainer callback 이벤트.



      //sap.m.Tree, sap.ui.table.TreeTable의 parent, child 프로퍼티 바인딩처리건 점검.
      function lf_chkTreeProp(is_attr){

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
          showMessage(sap, 20, "E", is_attr.valtx);
          return true;

        }


      } //sap.m.Tree, sap.ui.table.TreeTable의 parent, child 프로퍼티 바인딩처리건 점검.


      var l_ctxt = this.getBindingContext();

      var l_attr = l_ctxt.getProperty();

      //appcontainer의 AppID 프로퍼티인경우.
      if(l_attr.UIATK === "EXT00000030"){

        var l_opt = {autoSearch: true,
                     initCond: {PACKG: "", APPID: "", APPNM: "", ERUSR: "",HITS: 500}
                    };

        //application f4 help 팝업 호출.
        if (typeof oAPP.fn.fnAppF4PopupOpen !== "undefined") {
           oAPP.fn.fnAppF4PopupOpen(l_opt, lf_appCallback);
           return;
        }

        //js load후 application f4 help 팝업 호출.
        oAPP.loadJs("fnAppF4PopupOpen", function() {
           oAPP.fn.fnAppF4PopupOpen(l_opt, lf_appCallback);
        });

        return;
      }



      //f4 help callback function.
      function lf_returnDOC(a){
        debugger;
      } //f4 help callback function.



      //selectOption2의 F4HelpID프로퍼티인경우.
      if(l_attr.UIATK === "EXT00001188"){

        //f4 help팝업을 load한경우.
        if(typeof oAPP.fn.callF4HelpPopup !== "undefined"){
          //f4 help 팝업 호출.
          oAPP.fn.callF4HelpPopup("DD_SHLP","DD_SHLP",[],[],lf_returnDOC);
          return;
        }

        //f4help 팝업을 load하지 못한경우.
        oAPP.fn.getScript("callF4HelpPopup",function(){
            //f4 help 팝업 function load 이후 팝업 호출.
            oAPP.fn.callF4HelpPopup("DD_SHLP","DD_SHLP",[],[],lf_returnDOC);
        });

        return;
      }


      //sap.m.Tree, sap.ui.table.TreeTable의 parent, child 프로퍼티 바인딩처리건 점검.
      if(lf_chkTreeProp(l_attr) === true){
        return;
      }


      //바인딩 & 이벤트 팝업 호출 처리 function.
      lf_bindNEvtPopup(oEvent);

    }); //바인딩(서버 이벤트) 아이콘 선택 이벤트




    oRListItem1.addCell(oRIcon1);

    //help(script 이벤트) 아이콘
    var oRIcon2 = new sap.ui.core.Icon({src:"{icon2_src}",color:"{icon2_color}"});

    //help(script 이벤트) 아이콘 선택 이벤트
    oRIcon2.attachPress(function(oEvent){

      //property help DOCUMENT 팝업 호출.
      function lf_helpProp(){

        //선택한 라인이 프로퍼티건이 아닌경우 EXIT.
        if(ls_attr.UIATY !== "1"){return;}

        var l_url = "/ZU4A_ACS/U4A_API_DOCUMENT";

        //UI5 bootstrap 라이브러리 관리 정보(MIME PATH) 얻기.
        var ls_ua025 = oAPP.DATA.LIB.T_9011.find( a => a.CATCD === "UA025" &&
          a.FLD01 === "APP" && a.FLD06 === "X" );

        if(!ls_ua025){return;}

        //version.
        l_url = l_url + "?VER=" + ls_ua025.FLD07;

        var ls_tree = oAPP.attr.oModel.oData.TREE.find( a => a.OBJID === ls_attr.OBJID );
        if(!ls_tree){return;}

        //UI 라이브러리 명, PROPERTY 구분, 프로퍼티명, UI OBJECT KEY
        l_url = l_url + "&CLSNM=" + ls_tree.UILIB + "&GUBUN=1&PROPID=" + ls_attr.UIATT + "&UIOBK=" + ls_attr.UIOBK;

        //HELP 팝업 호출.
        fn_PropHelpPopup(l_url);

      } //property help DOCUMENT 팝업 호출.



      var l_ctxt = this.getBindingContext();
      var ls_attr = l_ctxt.getProperty();

      //선택한 라인이 이벤트인경우.
      if(ls_attr.UIATY === "2"){

        //OBJID + 이벤트명 대문자 로 client이벤트 script ID 구성.
        var l_objid = ls_attr.OBJID + ls_attr.UIASN;

        //클라이언트 스크립트 호출 FUNCTION 호출.
        oAPP.fn.fnClientEditorPopupOpener("JS", l_objid);
        return;

      }

      //Aggregation에서 아이콘 선택한 경우 exit.
      if(ls_attr.UIATY === "3"){
        return;
      }

      //property help DOCUMENT 팝업 호출.
      lf_helpProp();


    }); //help(script 이벤트) 아이콘 선택 이벤트



    oRListItem1.addCell(oRIcon2);


    oRTab1.bindAggregation("items",{path:"/T_ATTR",template:oRListItem1});

  };  //우측 페이지(attribute 영역) 구성




  //visible, editable등의 attribute 처리 전용 바인딩 필드 생성 처리.
  oAPP.fn.crtAttrBindField = function(is_0015){

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
    var lt_ua003 = oAPP.DATA.LIB.T_9011.filter( a => a.CATCD === "UA003");

    //세팅된 DOCUMENT 정보 검색.
    var lt_0015 = oAPP.attr.prev[OBJID]._T_0015.filter( a => a.OBJID === OBJID);

    //코드마스터의 UI5 Document 속성 정보 기준으로 attributes 정보 구성.
    for(var i=0, l= lt_ua003.length; i<l; i++){

      //신규라인 생성.
      var ls_0015 = oAPP.fn.crtStru0015();

      //attribute 화면제어 필드 생성.
      oAPP.fn.crtAttrBindField(ls_0015);

      //세팅된 DOCUMENT 정보 존재 여부 확인.
      var ls_temp = lt_0015.find( a => a.UIATK === lt_ua003[i].ITMCD);

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
      ls_0015.UIATK = lt_ua003[i].ITMCD;;
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

      oAPP.fn.getScript("createEventPopup",function(){
        //서버 이벤트 항목 검색.
        oAPP.fn.getServerEventList();
      },true);

    }else{
      //서버 이벤트 항목 검색.
      oAPP.fn.getServerEventList();

    }

    //ddlb 항목 구성.
    function lf_setDDLBList(VALKY,UIATY, DEFVL){

      var lt_ddlb = [],
          ls_ddlb = {};


      if(UIATY === "2"){
        return oAPP.attr.T_EVT;

      }

      var lt_0024 = oAPP.DATA.LIB.T_0024.filter( a => a.VALKY === VALKY);

      if(lt_0024.length === 0){return [];}

      //default value가 없는경우 ddlb에 빈라인 추가.
      if(DEFVL === ""){
        lt_ddlb.push({KEY:"",TEXT:""});
      }

      for(var i=0, l=lt_0024.length; i<l; i++){
        ls_ddlb.KEY = lt_0024[i].VALUE;
        ls_ddlb.TEXT = lt_0024[i].VALUE;
        lt_ddlb.push(ls_ddlb);
        ls_ddlb = {};

      }

      return lt_ddlb;

    } //ddlb 항목 구성.



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
      oAPP.fn.crtAttrBindField(ls_0015);

      //아이콘 활성여부 처리.
      ls_0015.bind_visb = true;  //바인딩 아이콘 visible
      ls_0015.help_visb = true;  //help 아이콘 visible


      //input or DDLB 활성여부 처리.
      if(lt_0023[i].ISLST === "X" || ls_0015.UIATY === "2"){
       //DDLB출력건인경우 DDLB visible
        ls_0015.sel_visb = true;

        //DDLB 항목 구성.
        ls_0015.T_DDLB = lf_setDDLBList(lt_0023[i].VALKY, ls_0015.UIATY, lt_0023[i].DEFVL);

      }else if(lt_0023[i].ISLST === ""){
        //DDLB출력건이 아닌경우 input visible
        ls_0015.inp_visb = true;

      }

      //Aggregation이 아닌경우 입력필드 입력 가능 처리.
      oAPP.fn.setAttrEditable(ls_0015);
      if(ls_0015.UIATY !== "3"){
        ls_0015.edit = true;
      }

      //프로퍼티 OR 직접입력 가능한 Aggregation(title 등)인경우
      if(ls_0015.UIATY === "1" && lt_0023[i].ISLST !== "X"){

        //TEXT 유형인경우.
        if(ls_0015.UIASN.indexOf("TITLE") !== -1 ||
           ls_0015.UIASN.indexOf("TEXT") !== -1 ||
           ls_0015.UIASN.indexOf("LABEL") !== -1 ||
           ls_0015.UIASN.indexOf("TOOLTIP") !== -1 ){

          ls_0015.icon3_src = "sap-icon://attachment-text-file";
        }

      }

      //UI 타입에 따른 로직 분기.
      switch(ls_0015.UIATY){
        case "1": //프로퍼티
          //바인딩 아이콘 처리
          ls_0015.icon1_src = "sap-icon://fallback";
          ls_0015.icon1_color = "#dec066";  //바인딩(서버이벤트) 색상 필드

          //help 아이콘 처리.
          ls_0015.icon2_src = "sap-icon://sys-help";
          ls_0015.icon2_color = "#40baf3";  //바인딩(서버이벤트) 색상 필드

          //
          ls_0015.UIATT_ICON = "";

          break;

        case "2": //이벤트
          //서버이벤트 아이콘 처리.
          if(oAPP.attr.oModel.oData.IS_EDIT){
            ls_0015.icon1_src = "sap-icon://developer-settings";
            ls_0015.icon1_color = "#c9e088";  //바인딩(서버이벤트) 색상 필드

            //클라이언트이벤트 아이콘 처리.
            ls_0015.icon2_src = "sap-icon://syntax";
            ls_0015.icon2_color = "#acaba7";  //바인딩(서버이벤트) 색상 필드

            //
            ls_0015.UIATT_ICON = "sap-icon://border";


          }

          break;

        case "3": //Aggregation
          //N개의 UI가 추가되는 Aggregation인경우
          if(ls_0015.ISMLB === "X"){
            //바인딩 아이콘 처리
            ls_0015.icon1_src = "sap-icon://fallback";
            ls_0015.icon1_color = "#dec066";  //바인딩(서버이벤트) 색상 필드
          }

          //help 아이콘 처리.
          ls_0015.icon2_src = "sap-icon://warning2";

          //Aggregation ICON 처리.
          ls_0015.UIATT_ICON = "sap-icon://border";


          break;

        default:
          break;

      } //UI 타입에 따른 로직 분기.

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
      ls_0015.icon1_color = "#dec066";  //바인딩(서버이벤트) 색상 필드

      //help 아이콘 처리.
      ls_0015.icon2_src = "sap-icon://sys-help";
      ls_0015.icon2_color = "#40baf3";  //바인딩(서버이벤트) 색상 필드


      oAPP.attr.oModel.oData.T_ATTR.push(ls_0015);

    } //얻은 정보 기준으로 attribute 항목 구성.

    //embed Aggregation 정보 검색.
    if(OBJID !== "APP"){

      var ls_0015 = oAPP.fn.crtStru0015();
      oAPP.fn.moveCorresponding(oAPP.attr.prev[OBJID]._T_0015.find( a=> a.OBJID === OBJID && a.UIATY === "6"), ls_0015);

      //visible, editable등의 attribute 처리 전용 바인딩 필드 생성 처리.
      oAPP.fn.crtAttrBindField(ls_0015);

      ls_0015.chk_visb = true; //checkbox visible

      ls_0015.UIATV_c = true;  //체크박스 선택 처리.

      ls_0015.edit = false;

      //embed Aggregation 정보 추가.
      oAPP.attr.oModel.oData.T_ATTR.push(ls_0015);

    }

    //대상 UI에 매핑되어있는 프로퍼티, 이벤트 항목에 대한건 ATTRIBUTE영역에 매핑.
    for(var i=0, l=oAPP.attr.oModel.oData.T_ATTR.length; i<l; i++){

      //대상 UI에 해당하는 입력건 검색.
      var ls_0015 = oAPP.attr.prev[OBJID]._T_0015.find( a => a.UIATK === oAPP.attr.oModel.oData.T_ATTR[i].UIATK );

      if(!ls_0015){continue;}

      //입력값 매핑.
      oAPP.attr.oModel.oData.T_ATTR[i].UIATV = ls_0015.UIATV;

      //바인딩처리된경우 하위 로직 수행.
      if(ls_0015.ISBND !== "X" ){continue;}

      //바인딩 구성정보 매핑.
      oAPP.attr.oModel.oData.T_ATTR[i].ISBND = ls_0015.ISBND;
      oAPP.attr.oModel.oData.T_ATTR[i].MPROP = ls_0015.MPROP;

      //입력 비활성 처리.
      oAPP.attr.oModel.oData.T_ATTR[i].edit = false;

    } //대상 UI에 매핑되어있는 프로퍼티, 이벤트 항목에 대한건 ATTRIBUTE영역에 매핑.


    //attr 입력 가능 여부 처리.
    for(var i=0, l=oAPP.attr.oModel.oData.T_ATTR.length; i<l; i++){

      //입력필드 입력 가능여부 처리.
      oAPP.fn.setAttrEditable(oAPP.attr.oModel.oData.T_ATTR[i]);

      //icon 처리.
      oAPP.fn.setExcepAttr(oAPP.attr.oModel.oData.T_ATTR[i]);

    }

    oAPP.attr.oModel.refresh(true);

    //attribute 영역 그룹핑 처리.
    oAPP.fn.setAttrModelSort();

  };  //선택한 UI에 해당하는 attribute 리스트 업데이트 처리.




  //attribute 영역 그룹핑 처리.
  oAPP.fn.setAttrModelSort = function(){

    var l_bind = oAPP.attr.oRTab1.getBinding('items');

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
  oAPP.fn.setUIInfo = function(is_tree, i_treePath){

    var ls_uiinfo = {};

    //ui 디자인영역에서 선택한 tree item의 바인딩 path 정보 매핑
    ls_uiinfo.treePath = i_treePath;

    //UI명.
    ls_uiinfo.OBJID_bf = ls_uiinfo.OBJID = is_tree.OBJID;

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

      //현재 UI 수집처리.
      parent._BIND_AGGR[EMBED_AGGR].push(oUi);
      return true;

    } //부모 model 바인딩 정보에 해당 UI 매핑 처리 function.



    //현재 UI의 property에 바인딩된 정보 얻기.
    var lt_0015 = oUi._T_0015.filter( a => a.ISBND === "X" && a.UIATV !== "" );

    //바인딩된 정보가 존재하지 않는경우 exit.
    if(lt_0015.length === 0){return;}

    //

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
    var l_sp1 = parent.split('-');

    //CHILD path를 -로 분리.
    var l_sp2 = child.split('-');

    //부모 path 부분만 남김.
    l_sp2.splice(l_sp1.length);

    //부모 path로부터 파생된 child path인경우.
    if(parent === l_sp2.join('-')){
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
  oAPP.fn.deltDesc = function(OBJID){

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


})();
