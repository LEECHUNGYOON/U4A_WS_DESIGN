//UI move Position 메뉴 선택시 팝업 UI
oAPP.fn.uiMovePosition = function(pos,max,f_callBack){

  //dialog 종료.
  function lf_close(){

    oDlg.close();
    oDlg.destroy();

  }

  sap.ui.getCore().loadLibrary('sap.m');
  var oDlg = new sap.m.Dialog({draggable:true,title:"move Position"});

  var oMdl = new sap.ui.model.json.JSONModel();
  oDlg.setModel(oMdl);

  var oLab1 = new sap.m.Label({text:"Max " + max ,design:"Bold"});
  oDlg.addContent(oLab1);

  var oStepInp = new sap.m.StepInput({min:1,max:"{/move/max}",value:"{/move/pos}"});
  oDlg.addContent(oStepInp);

  var oSlide = new sap.m.Slider({min:1,max:"{/move/max}",value:"{/move/pos}",enableTickmarks:true});
  oDlg.addContent(oSlide);

  //확인 버튼
  var oBtn1 = new sap.m.Button({icon:"sap-icon://accept",type:"Accept"});
  oDlg.addButton(oBtn1);

  //확인 버튼 선택 이벤트.
  oBtn1.attachPress(function(){

    var l_pos = oMdl.getProperty('/move/pos') - 1;

    //0 미만인경우 or max값을 초과한경우.
    if(l_pos < 0 || l_pos > max){
      parent.showMessage(sap, 10, 'I', '잘못된 위치를 입력했습니다.');
      return;
    }

    //위치 정보 call back function으로 return
    f_callBack(l_pos);

    //dialog 종료.
    lf_close();

  });

  //닫기 버튼
  var oBtn2 = new sap.m.Button({icon:"sap-icon://decline",type:"Reject"});
  oDlg.addButton(oBtn2);

  //닫기 버튼 선택 이벤트.
  oBtn2.attachPress(lf_close);

  oMdl.setData({"move":{"pos":pos,"max":max}});

  oDlg.open();


};
