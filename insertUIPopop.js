(function(){

  oAPP.fn.callUIInsertPopup = function(UIOBK, retFunc){

    //Aggregation Name DDLB 바인딩 정보 구성.
    var lt_sel = oAPP.DATA.LIB.T_0023.filter(a => a.UIOBK === UIOBK && a.UIATY === "3");

    var ls_sel = JSON.stringify(lt_sel[0]);
    ls_sel = JSON.parse(ls_sel);
    for(var i in ls_sel){
      ls_sel[i] = "";
    }
    //Aggregation DDLB에 빈값 라인 추가.
    lt_sel.splice(0,0,ls_sel);


    sap.ui.getCore().loadLibrary('sap.ui.layout');
    sap.ui.getCore().loadLibrary('sap.ui.table');
    sap.ui.getCore().loadLibrary('sap.m');

    var oDlg = new sap.m.Dialog({resizable:true,draggable:true,
      contentWidth:"50%",contentHeight:"60%",verticalScrolling:false});
    oDlg.addStyleClass("sapUiSizeCompact");


    var oVbox1 = new sap.m.VBox({height:"100%",renderType:"Bare"});
    oDlg.addContent(oVbox1);

    //dialog 타이틀 설정.
    var ls_0022 = oAPP.DATA.LIB.T_0022.find( a => a.UIOBK === UIOBK);
    if(ls_0022){
      oDlg.setTitle("UI Object Select [ " + ls_0022.UIOBJ + " ]");
    }

    var oMdl = new sap.ui.model.json.JSONModel();
    oDlg.setModel(oMdl);

    oMdl.setData({"T_SEL":lt_sel});

    var oFrm1 = new sap.ui.layout.form.Form({editable:true});
    oVbox1.addItem(oFrm1);

    var oRspLay1 = new sap.ui.layout.form.ResponsiveGridLayout(
      {singleContainerFullSize:false,adjustLabelSpan:false,labelSpanL:4,labelSpanM:4,columnsL:2});

    oFrm1.setLayout(oRspLay1);

    var oFrmCont1 = new sap.ui.layout.form.FormContainer();
    oFrm1.addFormContainer(oFrmCont1);

    var oFrmElem1 = new sap.ui.layout.form.FormElement();
    oFrmCont1.addFormElement(oFrmElem1);

    var oLab1 = new sap.m.Label({design: "Bold",text: "Aggregation Name"});
    oFrmElem1.setLabel(oLab1);

    var oSel1 = new sap.m.Select({width:"100%"});
    oFrmElem1.addField(oSel1);

    //Aggregation Name DDLB 선택 이벤트.
    oSel1.attachChange(function(){

      oMdl.oData.T_LIST = [];
      oMdl.setData({"T_LIST":[]},true);

      //테이블 라인선택 초기화.
      oTab1.clearSelection();

      //테이블 sort 초기화.
      oTab1.sort();

      //테이블 filter 초기화.
      for(var i=0,l=oTab1.mAggregations.columns.length; i<l;i++){
        oTab1.filter(oTab1.mAggregations.columns[i]);
      }

      //Aggregation name DDLB 선택값 얻기.
      var l_skey = oSel1.getSelectedKey();

      //빈값을 선택한 경우 exit.
      if(l_skey === ""){return;}

      //DDLB선택건에 해당하는 라인정보 얻기.
      var ls_sel = oMdl.oData.T_SEL.find(a => a.UIATK === l_skey);
      if(!ls_sel){return;}

      var l_vis01 = false;
      //n건 입력 가능한경우.
      if(ls_sel.ISMLB === "X"){
        l_vis01 = true;
      }

      //Generated Cnt 입력필드 활성여부 설정.
      oFrmElem2.setVisible(l_vis01);

      if(l_vis01 === false){
        oInp1.setValue(1);
      }

      var l_uifnd = ls_sel.UIADT.toUpperCase();

      var ls_0022 = oAPP.DATA.LIB.T_0022.find(a => a.UIFND === l_uifnd);
      if(!ls_0022){return;}

      var lt_0027t = oAPP.DATA.LIB.T_0027.filter( a => a.SGOBJ === ls_0022.UIOBK);
      if(!lt_0027t){return;}

      var lt_0022 = [],
          ls_0022 = {};

      for(var i=0, l=lt_0027t.length; i<l; i++){

        ls_0022 = oAPP.DATA.LIB.T_0022.find( a => a.UIOBK === lt_0027t[i].TGOBJ);

        if(ls_0022.ISDEP === "X" || ls_0022.OBJTY === "3"){continue;}

        lt_0022.push(ls_0022);

      }

      oMdl.setData({"T_LIST":lt_0022},true);


    }); //Aggregation Name DDLB 선택 이벤트.



    var oItm1 = new sap.ui.core.Item({key:"{UIATK}",text:"{UIATT}"});
    oSel1.bindAggregation("items",{path:"/T_SEL",template:oItm1});

    var oFrmElem2 = new sap.ui.layout.form.FormElement({visible:false});
    oFrmCont1.addFormElement(oFrmElem2);

    var oLab2 = new sap.m.Label({design: "Bold",text: "Generated Cnt"});
    oFrmElem2.setLabel(oLab2);

    var oInp1 = new sap.m.Input({type:"Number",maxLength:2,value:1});
    oFrmElem2.addField(oInp1);

    oInp1.attachChange(function(){
      var l_val = this.getValue();

      if(l_val === ""){
        oInp1.setValue(1);
        return;
      }

      //문자 제거.
      l_val = l_val.replace(/[^0-9.]/g, '');

      l_val = parseInt(l_val);

      if(l_val > 10){
        l_val = 10;
      }

      oInp1.setValue(l_val);

    });

    var oFrmElem3 = new sap.ui.layout.form.FormElement();
    oFrmCont1.addFormElement(oFrmElem3);

    var oLab9 = new sap.m.Label({design: "Bold",text: "UI Object"});
    oFrmElem3.setLabel(oLab9);

    var oInp2 = new sap.m.Input();
    oFrmElem3.addField(oInp2);

    //ui 검색 이벤트.
    oInp2.attachChange(function(){
        var l_val = this.getValue();

        var l_bind = oTab1.getBinding('rows');
        if(!l_bind){return;}

        var l_filter;
        if(l_val !== ""){
          l_filter = new sap.ui.model.Filter({path:"UIOBJ",operator:"Contains",value1:l_val});
        }

        l_bind.filter(l_filter);

    });


    var oTab1 = new sap.ui.table.Table({selectionMode: "Single",selectionBehavior:"Row",
      visibleRowCountMode:"Auto",layoutData:new sap.m.FlexItemData({growFactor:1})});
    oVbox1.addItem(oTab1);

    var oCol1 = new sap.ui.table.Column({hAlign:"Center",width:"80px"});
    oTab1.addColumn(oCol1);

    var oIcon1 = new sap.ui.core.Icon();
    oCol1.setTemplate(oIcon1);

    var oLab4 = new sap.m.Label({design: "Bold",text: "Img"});
    oCol1.setLabel(oLab4);

    var oCol2 = new sap.ui.table.Column({autoResizable:true,filterProperty:"UIOBJ",sortProperty:"UIOBJ"});
    oTab1.addColumn(oCol2);

    var oLab3 = new sap.m.Label({design: "Bold",text: "UI Object"});
    oCol2.setLabel(oLab3);

    var oTxt1 = new sap.m.Text({text:"{UIOBJ}"});
    oCol2.setTemplate(oTxt1);

    var oCol3 = new sap.ui.table.Column({autoResizable:true,filterProperty:"UIOMD",sortProperty:"UIOMD"});
    oTab1.addColumn(oCol3);

    var oLab6 = new sap.m.Label({design: "Bold",text: "UI Object(Fullname)"});
    oCol3.setLabel(oLab6);

    var oTxt2 = new sap.m.Text({text:"{UIOMD}"});
    oCol3.setTemplate(oTxt2);

    var oCol4 = new sap.ui.table.Column({hAlign:"Center",width:"120px",filterProperty:"UIOBK",sortProperty:"UIOBK"});
    oTab1.addColumn(oCol4);

    var oLab7 = new sap.m.Label({design: "Bold",text: "UI Key"});
    oCol4.setLabel(oLab7);

    var oTxt4 = new sap.m.Text({text:"{UIOBK}"});
    oCol4.setTemplate(oTxt4);

    var oCol5 = new sap.ui.table.Column({hAlign:"Center",width:"80px"});
    oTab1.addColumn(oCol5);

    var oLab8 = new sap.m.Label({design: "Bold",text: "UI Info"});
    oCol5.setLabel(oLab8);

    var oIcon2 = new sap.ui.core.Icon({src:"sap-icon://sys-help",height:"20px"});
    oCol5.setTemplate(oIcon2);

    var oRow1 = new sap.ui.table.Row();
    oTab1.bindAggregation('rows',{path:"/T_LIST",template:oRow1});

    //확인 버튼
    var oBtn1 = new sap.m.Button({icon: "sap-icon://accept",text: "Confirm",type: "Accept"});
    oDlg.addButton(oBtn1);

    oBtn1.attachPress(function(){
      //table의 선택 라인 index 얻기.
      var l_sidx = oTab1.getSelectedIndex();

      //선택한 라인이 없는경우 오류 처리.
      if(l_sidx === -1){
        parent.showMessage(sap, 20, 'E', '라인을 선택해 주십시오.');
        return;
      }

      var l_ret = {};

      var l_selky = oSel1.getSelectedKey();

      //ddlb 선택한정보(23번 테이블 구조)
      l_ret.E_EMB_AGGR = oAPP.DATA.LIB.T_0023.find(a => a.UIATK === l_selky);


      //리스트 선택정보(22번 테이블 구조)
      l_ret.E_UIOBJ = oMdl.getProperty("",oTab1.getContextByIndex(l_sidx));

      //리스트에서 선택한 ui가 갖고 있는 aggr 정보(23번 테이블)
      l_ret.E_AGGRT = oAPP.DATA.LIB.T_0023.filter(a => a.UIOBK === l_ret.E_UIOBJ.UIOBK && a.UIATY === "3" && a.ISDEP !== "X");

      //반복해서 만들 ui 갯수
      l_ret.E_CRTCNT = oInp1.getValue();


      //팝업 종료.
      oDlg.close();
      oDlg.destroy();

      //return parameter 전달.
      retFunc(l_ret);

    });


    //종료버튼
    var oBtn2 = new sap.m.Button({icon: "sap-icon://decline",text: "Cancel",type: "Reject"});
    oDlg.addButton(oBtn2);
    oBtn2.attachPress(function(){
      oDlg.close();
      oDlg.destroy();
    });

    oDlg.open();

  };

})();
