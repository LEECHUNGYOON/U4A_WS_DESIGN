// 이벤트 생성 팝업 호출.
oAPP.fn.createEventPopup = function(is_attr, f_callBack){

  function lf_dialogClose(){
    oDlg.close();
  }

  //서버 이벤트 ddlb 항목을 구성하지 않은경우.
  if(!oAPP.attr.T_EVT){
    //서버 이벤트 ddlb 구성.
    oAPP.fn.getServerEventList();
  }

  var oDlg = new sap.m.Dialog({
    title:"Server Event Create",
    draggable:true,
    icon:"sap-icon://add-document",
    contentWidth:"30%"
  });

  var oModel = new sap.ui.model.json.JSONModel();
  oDlg.setModel(oModel);

  sap.ui.getCore().loadLibrary('sap.ui.table');
  sap.ui.getCore().loadLibrary('sap.ui.layout');

  var oForm = new sap.ui.layout.form.Form({
    editable:true,
    layout: new sap.ui.layout.form.ResponsiveGridLayout()
  });
  oDlg.addContent(oForm);

  var oFmCont = new sap.ui.layout.form.FormContainer();
  oForm.addFormContainer(oFmCont);

  var oFmElem1 = new sap.ui.layout.form.FormElement({
    label : new sap.m.Label({design:"Bold",text:"Method Name",required:true})
  });
  oFmCont.addFormElement(oFmElem1);

  //Method Name 입력필드.
  var oFmInp1 = new sap.m.Input({
    value:"{/event/meth}",
    valueState:"{/event/meth_stat}",
    valueStateText:"{/event/meth_text}",
    maxLength:27
  });
  oFmElem1.addField(oFmInp1);


  var oFmElem2 = new sap.ui.layout.form.FormElement({
    label : new sap.m.Label({design:"Bold",text:"Description",required:true})
  });
  oFmCont.addFormElement(oFmElem2);

  var oFmInp2 = new sap.m.Input({
    value:"{/event/desc}",
    valueState:"{/event/desc_stat}",
    valueStateText:"{/event/desc_text}",
    maxLength:40
  });
  oFmElem2.addField(oFmInp2);

  //이벤트 생성 버튼.
  var oBtn1 = new sap.m.Button({type:"Accept",icon:"sap-icon://accept"});
  oDlg.addButton(oBtn1);

  //이벤트 생성 이벤트
  oBtn1.attachPress(function(){

    var l_erflag = false;
    var ls_event = oModel.getProperty('/event');

    //메소드명 대문자 변환 처리.
    ls_event.meth = ls_event.meth.toUpperCase();

    ls_event.meth_stat = 'None';
    ls_event.meth_text = '';
    ls_event.desc_stat = 'None';
    ls_event.desc_text = '';

    //이벤트 메소드명을 입력하지 않은경우.
    if(ls_event.meth === ""){
      ls_event.meth_stat = 'Error';
      ls_event.meth_text = 'Method Name dose not exits.';
      l_erflag = true;  //오류 flag 매핑.
    }

    //이벤트 메소드 description을 입력하지 않은경우.
    if(ls_event.desc === ""){
      ls_event.desc_stat = 'Error';
      ls_event.desc_text = 'Description dose not exists.';
      l_erflag = true;  //오류 flag 매핑.
    }


    var l_event = ls_event.meth;

    //이벤트메소드명 앞에 이벤트명 prefix가 없는경우.
    if(l_event.substr(0,3) !== "EV_"){
      //이벤트명 prefix 추가.
      l_event = "EV_" + l_event;
    }

    //이벤트 중복건 존재 여부 확인.
    if(oAPP.attr.T_EVT && oAPP.attr.T_EVT.findIndex( a => a.KEY === l_event) !== -1){

      ls_event.meth_stat = 'Error';
      ls_event.meth_text = 'Method Name dose not exits.';
      l_erflag = true;  //오류 flag 매핑.

    }

    //메소드명에 특수문자가 입력된 경우.
    var reg = /[^\w]/;
    if(reg.test(ls_event.meth) === true){
      ls_event.meth_stat = 'Error';
      ls_event.meth_text = 'Special characters are not allowed.';
      l_erflag = true;  //오류 flag 매핑.
    }

    //오류건이 존재하는 경우.
    if(l_erflag === true){
      oModel.setProperty('/event', ls_event);
      parent.showMessage(sap, 20, "E", "Check valid value.");
      return;
    }


    //클래스명 서버 전송 데이터에 구성.
    var oFormData = new FormData();
    oFormData.append("CLSNM", oAPP.attr.APPID.substr(0,1) + "CL_U4A_APP_"  + oAPP.attr.APPID.substr(1));

    //메소드명.
    oFormData.append("METH", ls_event.meth);

    //메소드 description.
    oFormData.append("DESC", ls_event.desc);

    //서버 생성 처리.
    var lt_servEvt = [];
    sendAjax(oAPP.attr.servNm + "/createEventMethod", oFormData, function(param){
      //오류가 발생한 경우.
      if(param.RETCD === "E"){
        ls_event.meth_stat = 'Error';
        ls_event.meth_text = param.RTMSG;
        oModel.setProperty('/event', ls_event);
        return;
      }

      //서버이벤트 DDLB 항목에 생성한 이벤트 메소드 정보 추가.
      oAPP.attr.T_EVT.push({KEY:param.RTMSG,TEXT:param.RTMSG,DESC:ls_event.desc});

      //CALLBACK function 호출.
      if(typeof f_callBack !== "undefined"){
        f_callBack(is_attr, param.RTMSG);
      }

      //attribute 영역에서 호출된건이 아닌경우.
      if(!is_attr){
        //attribute영역 갱신 처리.
        oAPP.attr.oModel.refresh();
      }

      //DIALOG 종료.
      lf_dialogClose();


    },'',false);


  });

  //팝업 종료 버튼.
  var oBtn2 = new sap.m.Button({type:"Reject",icon:"sap-icon://decline"});
  oDlg.addButton(oBtn2);

  //팝업 종료 이벤트.
  oBtn2.attachPress(function(){
    lf_dialogClose();
  });


  oModel.setData({"event":{"meth":"","desc":"",
    "meth_stat":"None","meth_text":"","desc_stat":"None","desc_text":""}});

  oDlg.open();



};


//서버 이벤트 항목 검색.
oAPP.fn.getServerEventList = function(){

  if(!oAPP.attr.T_EVT){
    oAPP.attr.T_EVT = [{KEY:"",TEXT:"",DESC:""}];
  }

  //클래스명 서버 전송 데이터에 구성.
  var oFormData = new FormData();
  oFormData.append("CLSNM", oAPP.attr.APPID.substr(0,1) + "CL_U4A_APP_"  + oAPP.attr.APPID.substr(1));


  //컨트롤러 클래스의 서버 이벤트 항목 정보 검색.
  sendAjax(oAPP.attr.servNm + "/getServerEventList", oFormData, function(param){
      if(param.RETCD !== "S"){return;}

      var ls_evt_DDLB = {};

      for(var i=0, l=param.EVTLT.length; i<l; i++){

        //ddlb 항목 수집건 존재 여부 확인.
        var l_find = oAPP.attr.T_EVT.findIndex( a => a.KEY === param.EVTLT[i].EVTNM);

        //수집건 항목이 존재시 skip.
        if(l_find !== -1){
          continue;
        }

        ls_evt_DDLB.KEY = ls_evt_DDLB.TEXT = param.EVTLT[i].EVTNM;
        ls_evt_DDLB.DESC = param.EVTLT[i].DESC;
        oAPP.attr.T_EVT.push(ls_evt_DDLB);
        ls_evt_DDLB = {};

      }

    },'',false);


};
