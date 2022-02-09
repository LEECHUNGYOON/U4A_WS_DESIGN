(function(){
  oAPP.fn.aggrSelectPopup = function(i_drag, i_drop, retfunc){

    //drop 대상 ui의 aggregation 정보 얻기.
    var lt_0023 = oAPP.DATA.LIB.T_0023.filter(a => a.UIOBK === i_drop.UIOBK && a.UIATY === "3");

    var l_upper = "",
        ls_0022 = {},
        ls_0027 = {},
        lt_sel = [],
        l_agrnm = "",
        l_child;

    //drag UI의 inheritance 정보
    var lt_0027 = oAPP.DATA.LIB.T_0027.filter( a => a.TGOBJ === i_drag.UIOBK);


    for(var i=0, l = lt_0023.length; i<l; i++){

      //get aggregation명 얻기.
      l_agrnm = oAPP.fn.getUIAttrFuncName(oAPP.attr.prev[i_drop.OBJID], "3", lt_0023[i].UIATT,"_sGetter");

      //해당 aggregation의 child 정보 얻기.
      l_child = oAPP.attr.prev[i_drop.OBJID][l_agrnm]();

      //해당 aggregation에 n건 바인딩이 설정된 경우
      //child UI가 이미 존재하는 경우 skip.
      if(oAPP.attr.prev[i_drop.OBJID]._MODEL[lt_0023[i].UIATT] &&
        (l_child !== null || l_child.length !== 0)){
        continue;
      }

      //0:1 aggregation에 이미 ui가 존재하는 경우 skip.
      if(lt_0023[i].ISMLB === "" && l_child){
        continue;
      }

      //aggregation 타입 대문자 전환(SAP.UI.CORE.CONTROL)
      l_upper = lt_0023[i].UIADT.toUpperCase();

      //라이브러리 테이블에서 해당 UI 검색.
      ls_0022 = oAPP.DATA.LIB.T_0022.find( a => a.UIFND === l_upper);
      if(!ls_0022){continue;}

      //drag UI가 drop UI의 aggregation type과 동일한경우 수집 처리.
      if(i_drag.UIOBK === ls_0022.UIOBK){
        lt_sel.push(lt_0023[i]);
        continue;
      }

      ls_0027 = lt_0027.find( b => b.SGOBJ === ls_0022.UIOBK);
      if(!ls_0027){continue;}
      lt_sel.push(lt_0023[i]);

    }

    //선택가능 aggregation리스트가 존재하지 않는경우.
    if(lt_sel.length === 0){
      parent.showMessage(sap, 10, 'I', '이동 가능한 aggregation이 존재하지 않습니다.');
      return;
    }

    //선택 가능한 aggregation이 1건인경우 해당 aggregation return.
    if(lt_sel.length === 1){
      retfunc(lt_sel[0], i_drag, i_drop);
      return;
    }


    sap.ui.getCore().loadLibrary('sap.m');
    var oDlg1 = new sap.m.Dialog({draggable:true,title:"Aggregation List"});
    oDlg1.addStyleClass("sapUiSizeCompact");

    var oMdl = new sap.ui.model.json.JSONModel();
    oDlg1.setModel(oMdl);

    oMdl.setData({"T_SEL":lt_sel});


    //dialog title 구성.

    //aggregation ddlb 구성.
    var oSel1 = new sap.m.Select({width:"100%"});

    var oItm1 = new sap.ui.core.Item({key:"{UIATK}",text:"{UIATT}"});
    oSel1.bindAggregation("items",{path:"/T_SEL",template:oItm1});

    oDlg1.addContent(oSel1);

    oSel1.setSelectedIndex(0);



    //확인버튼
    var oBtn1 = new sap.m.Button({icon: "sap-icon://accept",text: "Confirm",type: "Accept"});
    oDlg1.addButton(oBtn1);

    oBtn1.attachPress(function(){

      var l_sel = oSel1.getSelectedKey();

      ls_0023 = oAPP.DATA.LIB.T_0023.find( a => a.UIATK === l_sel);
      if(!ls_0023){return;}

      oDlg1.close();
      oDlg1.destroy();

      retfunc(ls_0023, i_drag, i_drop);

    });


    //닫기버튼
    var oBtn2 = new sap.m.Button({icon: "sap-icon://decline",text: "Cancel",type: "Reject"});
    oDlg1.addButton(oBtn2);

    //닫기버튼 이벤트
    oBtn2.attachPress(function(){
      oDlg1.close();
      oDlg1.destroy();
    });

    oDlg1.open();

  };

})();
