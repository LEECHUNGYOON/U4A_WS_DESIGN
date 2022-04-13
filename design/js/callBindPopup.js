//바인딩 팝업 처리 function.
oAPP.fn.callBindPopup = function(sTitle, CARDI, f_callback, UIATK){

  //팝업 종료 function.
  function lf_closePopup(){

    //모델 초기화.
    var l_model = oAPP.attr.oBindDialog.getModel();
    l_model.oData = {};
    l_model.refresh();

    //dialog종료.
    oAPP.attr.oBindDialog.close();

  }


  //바인딩 가능여부 flag 처리.
  function lf_setBindEnable(it_tree, l_path, l_model, KIND){

    if(it_tree.length === 0){return;}

    for(var i=0, l=it_tree.length; i<l; i++){

      switch(it_tree[i].KIND){
        case "T": //TABLE인경우.

          //property에서 바인딩 팝업 호출시 n건 바인딩 path와 현재 path가 동일한 경우 하위 탐색.
          if(oAPP.attr.oBindDialog._CARDI === "F" && ( l_path && l_path.substr(0,it_tree[i].CHILD.length) === it_tree[i].CHILD)){

            var lt_child = l_model.oData.TREE.filter( a => a.PARENT === it_tree[i].CHILD );
            lf_setBindEnable(lt_child, l_path, l_model, it_tree[i].KIND);
            continue;

          }

          //property에서 바인딩 팝업 호출시 table인경우 하위 정보 활성화 skip.
          if(oAPP.attr.oBindDialog._CARDI === "F"){
            continue;
          }

          //aggregation인경우 첫번째 만나는 TABLE은 선택 가능 처리 후 하위 정보 활성화 SKIP.
          if(oAPP.attr.oBindDialog._CARDI === "T" && l_path === it_tree[i].CHILD){

            var lt_child = l_model.oData.TREE.filter( a => a.PARENT === it_tree[i].CHILD && a.KIND !== "E" );
            lf_setBindEnable(lt_child, l_path, l_model, it_tree[i].KIND);
            continue;
          }

          //aggregation인경우 첫번째 만나는 TABLE은 선택 가능 처리 후 하위 정보 활성화 SKIP.
          if(oAPP.attr.oBindDialog._CARDI === "T"){
            it_tree[i].enable = true;
            it_tree[i].stat_src = "sap-icon://status-positive";
            it_tree[i].stat_color = "#01DF3A";

            if(it_tree[i].CHILD === oAPP.attr.oBindDialog._is_attr.UIATV){
              it_tree[i].stat_src = "sap-icon://accept";
            }

            continue;
          }

          break;

        case "S": //STRUCTURE인경우.

          var l_KIND = "";

          //aggregation인경우 일반 필드는 검색 불필요 함으로 제외 조건값 구성.
          if(oAPP.attr.oBindDialog._CARDI === "T"){
            l_KIND = "E";
          }

          if(oAPP.attr.oBindDialog._CARDI === "S"){
            it_tree[i].enable = true;
            it_tree[i].stat_src = "sap-icon://status-positive";
            it_tree[i].stat_color = "#01DF3A";
          }

          //현재 path의 하위 path정보 얻기.
          var lt_child = l_model.oData.TREE.filter( a => a.PARENT === it_tree[i].CHILD && a.KIND !== l_KIND);

          //하위 path를 탐색하며 선택 가능 flag 처리.
          lf_setBindEnable(lt_child, l_path, l_model, KIND);
          break;

        case "E": //일반 필드인경우.

          //TREE의 경우PARENT, CHILD에 바인딩시 바인딩된 AGGR의 TABLE건만 가능.
          if(oAPP.attr.oBindDialog._is_attr.UIATK === "EXT00001190" ||
             oAPP.attr.oBindDialog._is_attr.UIATK === "EXT00001191" ||
             oAPP.attr.oBindDialog._is_attr.UIATK === "EXT00001192" ||
             oAPP.attr.oBindDialog._is_attr.UIATK === "EXT00001193"){

             if(l_path && it_tree[i].CHILD.substr(0, l_path.length) !== l_path){
              continue;

             }

          }

          
          //property인경우 필드 선택 가능 처리.
          if(oAPP.attr.oBindDialog._CARDI === "F"){

            if(l_path && KIND === "T" && it_tree[i].CHILD.substr(0, l_path.length) !== l_path){
              continue;
            }

            it_tree[i].enable = true;
            it_tree[i].stat_src = "sap-icon://status-positive";
            it_tree[i].stat_color = "#01DF3A";

            //현재 path가 이전 바인딩값과 동일한 경우.
            if(it_tree[i].CHILD === oAPP.attr.oBindDialog._is_attr.UIATV){
              //선택됨 icon 처리.
              it_tree[i].stat_src = "sap-icon://accept";

              //이전 선택한 바인딩 상세정보가 존재하는경우.
              if(oAPP.attr.oBindDialog._is_attr.MPROP !== ""){
                //바인딩 상세정보 매핑.
                it_tree[i].MPROP = oAPP.attr.oBindDialog._is_attr.MPROP;
              }
            }

          }
          break;

      }

    }

  } //바인딩 가능여부 flag 처리.

  //서버에서 바인딩 attr 정보 얻은 이후 popup open
  function lf_openPopup(){

    //binding popup open
    oAPP.attr.oBindDialog.open();

    //화면 잠금 처리.
    oAPP.attr.oBindDialog._oModel.setProperty("/busy",true);

    //클래스명 서버 전송 데이터에 구성.
    var oFormData = new FormData();
    oFormData.append("CLSNM", oAPP.attr.APPID.substr(0,1) + "CL_U4A_APP_"  + oAPP.attr.APPID.substr(1));

    //바인딩 필드 정보 검색.
    sendAjax(oAPP.attr.servNm + "/getBindAttrData", oFormData, function(param){

      var l_model = oAPP.attr.oBindDialog.getModel();

      l_model.oData.TREE = param.T_ATTR;

      //바인딩 정보가 존재하지 않는경우.
      if(l_model.oData.TREE.length === 0){
        //tree 정보 공백 처리.
        l_model.oData.zTREE = [];

        //화면 잠금 해제 처리.
        l_model.oData.busy = false;
         
        //모델 정보 바인딩 처리.
        l_model.refresh(true);

        //바인딩 필드가 존재하지 않음 메시지 처리.
        parent.showMessage(sap, 10, "E", "Binding attributes dose not exist.");

        return;

      }

      //controller의 바인딩 가능 attribute 정보가 존재하는경우.
      if(l_model.oData.TREE.length !== 0){

        //n건 바인딩 처리된 UI인지 여부 확인.
        var l_path = oAPP.fn.getParentAggrBind(oAPP.attr.prev[oAPP.attr.oBindDialog._is_attr.OBJID]);


        //바인딩 팝업을 호출한 attribute정보가 sap.m.Tree의 parent, child인경우.
        if(oAPP.attr.oBindDialog._is_attr.UIATK === "EXT00001190" ||  //parent
           oAPP.attr.oBindDialog._is_attr.UIATK === "EXT00001191"){   //child

           //items aggregation에 바인딩된 정보 매핑.
           l_path = oAPP.attr.prev[oAPP.attr.oBindDialog._is_attr.OBJID]._MODEL["items"];

        //바인딩 팝업을 호출한 attribute정보가 sap.ui.table.TreeTable의 parent, child인경우.
        }else if(oAPP.attr.oBindDialog._is_attr.UIATK === "EXT00001192" || //parent
                 oAPP.attr.oBindDialog._is_attr.UIATK === "EXT00001193"){  //child

           //rows aggregation에 바인딩된 정보 매핑.
           l_path = oAPP.attr.prev[oAPP.attr.oBindDialog._is_attr.OBJID]._MODEL["rows"];

        }

        //2레벨의 TABLE, STRUCTURE정보만 발췌.
        var lt_filt = l_model.oData.TREE.filter( a => a.ZLEVEL === 2 && a.KIND !== "E");

        //TABLE, STRUCTURE를 탐색하며 선택 가능 여부 처리.
        lf_setBindEnable(lt_filt, l_path, l_model);

        //tree 바인딩 정보 구성.
        oAPP.fn.setTreeJson(l_model,"TREE","CHILD","PARENT","zTREE");

      }

      //화면 입력 가능 여부 처리.
      l_model.oData.edit = oAPP.attr.oModel.oData.IS_EDIT;


      //tree 전체 접힘 처리.
      oAPP.attr.oBindDialog._oTree.collapseAll();

      //이전 선택 라인정보 초기화.
      oAPP.attr.oBindDialog._oTree.clearSelection();

      //이전 바인딩 정보가 존재하는경우 해당 라인 펼침 처리.
      lf_setSelectTreeItem();

      //바인딩 추가속성 표시 여부 설정.
      lf_setBindPopupLayout(true);

      //화면 잠금 해제 처리.
      l_model.oData.busy = false;

      //모델 정보 바인딩 처리.
      l_model.refresh(true);


    },"");  //바인딩 필드 정보 검색.

  } //서버에서 바인딩 attr 정보 얻은 이후 popup open



  //라인선택 이벤트
  function lf_selTabRow(oEvent){

    var l_indx = this.getSelectedIndex();
    if(l_indx === -1){return;}

    var l_bind = this.getBinding("rows");

    var l_ctxt = l_bind.getContextByIndex(l_indx);
    if(!l_ctxt){return;}

    var ls_tree = l_ctxt.getProperty();

    //선택 가능 flag가 아닌경우
    if(ls_tree.enable !== true){

      //좌측 tree 영역 100%으로 설정(우측 바인딩 세부정보 비활성 처리)
      oAPP.attr.oBindDialog._oModel.oData.width = "100%";
      oAPP.attr.oBindDialog._oModel.oData.resize = false;
      oAPP.attr.oBindDialog._oModel.refresh();

      //선택 해제 처리.
      this.clearSelection();

      return;
    }

    //프로퍼티에서 바인딩 팝업 호출시 추가속성 정보 활성 처리.
    if(oAPP.attr.oBindDialog._CARDI === "F"){
      oAPP.attr.oBindDialog._oModel.oData.width = "65%";
      oAPP.attr.oBindDialog._oModel.oData.resize = true;
    }

    //바인딩 팝업 호출 프로퍼티 유형에 따른 화면 제어.
    //lf_setBindPopupLayout();


    var l_path = l_ctxt.getPath();

    l_path = l_path.substr(0,l_path.lastIndexOf("/"));

    //추가속성 정보 출력 처리.
    lf_setAdditBindInfo(ls_tree, oAPP.attr.oBindDialog._oModel.getProperty(l_path));

  } //라인선택 이벤트



  //이전 바인딩 정보가 존재하는경우 해당 라인 펼침 & 선택 처리
  function lf_setSelectTreeItem(){

    var lt_split = [],
        L_UIATV = "";

    //n건 바인딩 처리된 UI인지 여부 확인.
    var l_path = oAPP.fn.getParentAggrBind(oAPP.attr.prev[oAPP.attr.oBindDialog._is_attr.OBJID]);

    //이전 바인딩 정보가 존재하는경우
    if(oAPP.attr.oBindDialog._is_attr.UIATV !== "" &&
       oAPP.attr.oBindDialog._is_attr.ISBND === "X"){

       L_UIATV = oAPP.attr.oBindDialog._is_attr.UIATV;

    }

    //이전 바인딩 정보가 존재하지 않지만 n건 바인딩 정보가 존재하는경우.
    if(L_UIATV === "" && l_path){
      //n건 바인딩 path 매핑.
      L_UIATV = l_path;
    }

    //이전 바인딩 path가 존재하는 경우.
    if(L_UIATV !== ""){
      //이전 바인딩 PATH를 -로 분리.
       lt_split = L_UIATV.split("-");
    }


    var l_cnt = 0;
    oAPP.attr.oBindDialog._oTree.expand(l_cnt);

    //default 일반 필드 타입.
    var l_KIND = "E";

    //aggregation에서 바인딩 팝업 호출한경우 TABLE 필드 타입.
    if(oAPP.attr.oBindDialog._CARDI === "T"){
      l_KIND = "T";
    }

    //TREE를 하위로 탐색하며 바인딩 PATH에 해당하는건 EXPAND, 라인 선택 처리.
    lf_expand(oAPP.attr.oBindDialog._oModel.oData.zTREE[0].zTREE);


    //TREE를 하위로 탐색하며 바인딩 PATH에 해당하는건 EXPAND, 라인 선택 처리 재귀호출 function.
    function lf_expand(T_TREE){

      for(var i=0, l=T_TREE.length; i<l; i++){

        l_cnt += 1;

        //현재 TREE의 타입이 STRUCTURE인경우.
        if(T_TREE[i].KIND === "S"){

          //해당 구조 하위에 구조 or 일반필드(table 필드)가 존재하는지 여부 확인.
          var l_find = T_TREE[i].zTREE.findIndex( a => a.KIND === l_KIND || a.KIND === "S" );

          //존재하는경우 하위 탐색.
          if(l_find !== -1){
            //해당 라인 펼침 처리.
            oAPP.attr.oBindDialog._oTree.expand(l_cnt);

            lf_expand(T_TREE[i].zTREE);
            continue;

          }

        }

        //현재 TREE의 PATH와 이전 바인딩 PATH가 부합되지 않는경우 SKIP.
        if(T_TREE[i].CHILD !== lt_split.slice(0,parseInt(T_TREE[i].ZLEVEL)-1).join("-")){
          continue;
        }

        //현재 TREE의 PATH가 바인딩 팝업 호출시 이전 바인딩 PATH정보와 동일한건인경우.
        if(oAPP.attr.oBindDialog._is_attr.UIATV === T_TREE[i].CHILD){
          //TREE TABLE의 해당 라인 선택 처리.
          oAPP.attr.oBindDialog._oTree.setSelectedIndex(l_cnt);
          continue;
        }

        //현재 TREE의 PATH와 이전 바인딩 PATH가 부합되는경우 해당 라인 펼침 처리.
        oAPP.attr.oBindDialog._oTree.expand(l_cnt);

        lf_expand(T_TREE[i].zTREE);

      }

    }

  } //이전 바인딩 정보가 존재하는경우 해당 라인 펼침 & 선택 처리



  //바인딩 팝업 호출 프로퍼티 유형에 따른 화면 제어.
  function lf_setBindPopupLayout(is_frist){

    //화면제어 처리가 된경우 하위로직 skip.
    if(oAPP.attr.oBindDialog._oModel.oData.isSetLay){return;}

    //프로퍼티에서 바인딩 팝업 호출한경우 이전 바인딩 정보가 존재하지 않는경우.
    if(is_frist === true && oAPP.attr.oBindDialog._CARDI === "F" &&
       oAPP.attr.oBindDialog._is_attr.ISBND !== "X" ){
       //최초 1번 바인딩 추가속성 정보 비활성 처리.
       oAPP.attr.oBindDialog._oModel.oData.width = "100%";
       oAPP.attr.oBindDialog._oModel.oData.resize = false;
       return;

    }

    //화면제어 처리됨 flag 처리.
    oAPP.attr.oBindDialog._oModel.oData.isSetLay = true;

    //aggregation인경우 바인딩 추가속성정보 비활성.
    if(oAPP.attr.oBindDialog._CARDI === "T"){
      oAPP.attr.oBindDialog._oModel.oData.width = "100%";
      oAPP.attr.oBindDialog._oModel.oData.resize = false;
      return;
    }

    //프로퍼티에서 바인딩 팝업 호출시 추가속성 정보 활성 처리.
    if(oAPP.attr.oBindDialog._CARDI === "F"){
      oAPP.attr.oBindDialog._oModel.oData.width = "65%";
      oAPP.attr.oBindDialog._oModel.oData.resize = true;
    }

  } //바인딩 팝업 호출 프로퍼티 유형에 따른 화면 제어.



  //추가속성 정보 출력 처리.
  function lf_setAdditBindInfo(is_tree, it_parent){

    //바인딩 팝업 호출 ATTR의 타입이 프로퍼티가 아닌경우 EXIT.
    if(oAPP.attr.oBindDialog._CARDI !== "F"){return;}

    //바인딩 추가 속성 정보 초기화.
    oAPP.attr.oBindDialog._oModel.oData.T_MPROP = [];


    //바인딩 추가속성 리스트 얻기.
    var lt_ua028 = oAPP.DATA.LIB.T_9011.filter( a => a.CATCD === "UA028" );

    var ls_mprop = {},
        lt_split = [];

    //바인딩 추가 속성 정의건이 존재하는 경우.
    if(is_tree.MPROP){
      lt_split = is_tree.MPROP.split("|");
    }

    //nozero 가능 항목.
    var l_nozero = "IbsNP";

    //number format 가능항목.
    var l_numfmt = "IP";

    for(var i=0, l=lt_ua028.length, l_cnt=0; i<l; i++){

      ls_mprop.ITMCD = lt_ua028[i].ITMCD;
      ls_mprop.prop = lt_ua028[i].FLD01;
      ls_mprop.val = "";
      ls_mprop.stat = "None";
      ls_mprop.statTxt = "";

      ls_mprop.edit = false;
      ls_mprop.inp_vis = false;
      ls_mprop.sel_vis = false;
      ls_mprop.txt_vis = false;

      //조회모드 여부 (예:X) 가 아닌경우 화면 edit 처리.
      if(lt_ua028[i].FLD02 !== "X"){
        ls_mprop.edit = true;
      }

      switch(lt_ua028[i].ITMCD){

        case "P01": //Field name
          ls_mprop.val = is_tree.NTEXT;
          ls_mprop.txt_vis = true;
          break;

        case "P02": //Field path
          ls_mprop.val = is_tree.CHILD;
          ls_mprop.txt_vis = true;
          break;

        case "P03": //type
          ls_mprop.val = is_tree.TYPE;
          ls_mprop.txt_vis = true;
          break;

        case "P04": //Bind type
          if(is_tree.MPROP){
            ls_mprop.val = lt_split[0];
          }
          ls_mprop.sel_vis = true;

          //P 타입이 아닌경우 입력 필드 잠금 처리.
          if(is_tree.TYPE_KIND !== "P"){
            ls_mprop.edit = false;
          }

          ls_mprop.T_DDLB = [{"KEY":"","TEXT":""},
                             {"KEY":"sap.ui.model.type.Currency","TEXT":"sap.ui.model.type.Currency"},
                             {"KEY":"ext.ui.model.type.Quantity","TEXT":"ext.ui.model.type.Quantity"}
                            ];

          break;

        case "P05": //Reference Field name
          if(is_tree.MPROP){
            ls_mprop.val = lt_split[1];
          }
          ls_mprop.sel_vis = true;

          //구조(TAB) 안에 있는 필드 중 CUKY, UNIT 타입이 없으면 잠김.
          lt_filt = it_parent.filter( a => a.DATATYPE === "CUKY" || a.DATATYPE === "UNIT")

          //금액, UNIT 참조필드가 존재하지 않는경우 화면 잠금 처리.

          ls_mprop.edit = false;

          if(lt_filt.length !== 0){

            ls_mprop.edit = true;

            ls_mprop.T_DDLB = [{"KEY":"","TEXT":""}];

            for(var j=0, l2=lt_filt.length,ls_ddlb={}; j<l2; j++){

              ls_ddlb.KEY = ls_ddlb.TEXT = lt_filt[j].CHILD;
              ls_mprop.T_DDLB.push(ls_ddlb);
              ls_ddlb = {};

            }

          }

          if(lt_split.length === 0 || lt_split[0] === ""){
            ls_mprop.edit = false;
          }

          break;

        case "P06": //Conversion Routine

          ls_mprop.val = is_tree.CONVE;

          ls_mprop.maxlen = 5;

          if(is_tree.MPROP){
            ls_mprop.val = lt_split[2];
          }
          ls_mprop.inp_vis = true;
          break;

        case "P07": //Nozero
          if(is_tree.MPROP){
            ls_mprop.val = lt_split[3];
          }

          //값이 존재하지 않는경우 default false
          if(ls_mprop.val === ""){
            ls_mprop.val = "false";
          }

          ls_mprop.sel_vis = true;

          //Nozero 가능항목에 속하지 않는 타입인경우 입력필드 잠금 처리.
          if(l_nozero.indexOf(is_tree.TYPE_KIND) === -1){
            ls_mprop.edit = false;
          }

          ls_mprop.T_DDLB = [{"KEY":"true","TEXT":"true"},
                             {"KEY":"false","TEXT":"false"}
                            ];

          break;

        case "P08": //Is number format?
          if(is_tree.MPROP){
            ls_mprop.val = lt_split[4];
          }

          //값이 존재하지 않는경우 default false
          if(ls_mprop.val === ""){
            ls_mprop.val = "false";
          }

          ls_mprop.sel_vis = true;

          //number format 가능항목에 속하지 않는 타입인경우 입력필드 잠금 처리.
          if(l_numfmt.indexOf(is_tree.TYPE_KIND) === -1){
            ls_mprop.edit = false;
          }

          ls_mprop.T_DDLB = [{"KEY":"true","TEXT":"true"},
                             {"KEY":"false","TEXT":"false"}
                            ];

          break;
      }

      oAPP.attr.oBindDialog._oModel.oData.T_MPROP.push(ls_mprop);
      ls_mprop = {};

    }


    oAPP.attr.oBindDialog._oModel.refresh();

  } //추가속성 정보 출력 처리.



  //바인딩 선택전 점검.
  function lf_chkBindVal(bskipSelIndex, is_tree){

    //선택라인 점검 필요시.
    if(bskipSelIndex){
      var l_indx = oAPP.attr.oBindDialog._oTree.getSelectedIndex();

      //선택한 라인이 존재하지 않는경우.
      if(l_indx === -1){
        parent.showMessage(sap, 10, "E", "Select field information for Binding.");
        return true;
      }

    }

    //선택 가능한 라인인지 여부 확인.
    if(is_tree.enable !== true){
      parent.showMessage(sap, 10, "E", "해당 라인은 선택할 수 없습니다.");
      return true;
    }

    //aggregation인경우 하위 로직 점검 skip.
    if(oAPP.attr.oBindDialog._CARDI === "T"){
      return false;
    }

    if(!oAPP.attr.oBindDialog._oModel.oData.T_MPROP){return;}

    var ls_P04 = oAPP.attr.oBindDialog._oModel.oData.T_MPROP.find( a => a.ITMCD === "P04");

    //Bind type이 지정된 경우
    if(ls_P04.val !== ""){

      var ls_P05 = oAPP.attr.oBindDialog._oModel.oData.T_MPROP.find( a => a.ITMCD === "P05");

      //Reference Field name이 존재하지 않는경우.
      if(ls_P05.val === ""){
        ls_P05.stat = "Error";
        ls_P05.statTxt = "If Bind type is selected, Reference Field name is required.";

        parent.showMessage(sap, 10, "E", ls_P05.statTxt);
        return true;

      }

    }

    var ls_P06 = oAPP.attr.oBindDialog._oModel.oData.T_MPROP.find( a => a.ITMCD === "P06");

    //Conversion Routine명을 입력하지 않은경우 점검 skip.
    if(ls_P06.val === ""){return;}

    //Conversion Routine명 서버전송 데이터 구성.
    var oFormData = new FormData();
    oFormData.append("CONVEXIT", ls_P06.val);

    var l_ret = false;

    // Conversion Routine 존재여부 확인.
    sendAjax(oAPP.attr.servNm + "/chkConvExit", oFormData,function(param){
      //잘못된 Conversion Routine을 입력한 경우.
      if(param.RETCD === "E"){
        ls_P06.stat = "Error";
        ls_P06.statTxt = param.RTMSG;
        parent.showMessage(sap, 10, "E", param.RTMSG);
        l_ret = true;
      }

    },"",false);


    return l_ret;

  } //바인딩 선택전 점검.



  //바인딩 추가속성정보 메시지 초기화.
  function lf_resetMPROPMsg(){

    //프로퍼티에서 바인딩 팝업 호출된건이 아닌경우 SKIP.
    if(oAPP.attr.oBindDialog._CARDI !== "F"){return;}

    if(typeof oAPP.attr.oBindDialog._oModel.oData.T_MPROP === "undefined" || 
      oAPP.attr.oBindDialog._oModel.oData.T_MPROP.length === 0){
        return;
    }

    
    for(var i=0, l=oAPP.attr.oBindDialog._oModel.oData.T_MPROP.length; i<l; i++){
      oAPP.attr.oBindDialog._oModel.oData.T_MPROP[i].stat = "None";
      oAPP.attr.oBindDialog._oModel.oData.T_MPROP[i].statTxt = "";
    }

  } //바인딩 추가속성정보 메시지 초기화.



  //bind 버튼 선택 이벤트.
  function lf_bindBtnEvt(oCtxt){

    //바인딩 추가속성정보 메시지 초기화.
    lf_resetMPROPMsg();

    //편집 가능 상태가 아닌경우 exit.
    if(oAPP.attr.oModel.oData.IS_EDIT !== true){
      return;
    }

    
    l_cxtx = oCtxt;

    //context 파라메터가 존재하지 않는경우 table의 라인선택건 정보 판단.
    if(typeof oCtxt === "undefined"){      

      var l_indx = oAPP.attr.oBindDialog._oTree.getSelectedIndex();

      //선택한 라인이 존재하지 않는경우.
      if(l_indx === -1){
        parent.showMessage(sap, 10, "E", "선택한 라인이 존재하지 않습니다.");
        return true;
      }

      var l_cxtx = oAPP.attr.oBindDialog._oTree.getContextByIndex(l_indx);

    }

    var ls_tree = l_cxtx.getProperty(),
        lt_MPROP = oAPP.attr.oBindDialog._oModel.oData.T_MPROP;

        
    
    //bind전 입력값 점검시 오류가 발생한 경우 exit.
    if(lf_chkBindVal(oCtxt ? false : true, ls_tree) === true){
      oAPP.attr.oBindDialog._oModel.refresh();
      return;
    }

    //프로퍼티에서 바인딩 팝업을 호출한 경우.
    if(oAPP.attr.oBindDialog._CARDI === "F"){

      for(var i=3, l=lt_MPROP.length, l_array = []; i<l; i++){
        //바인딩 추가 속성 정보 수집.
        l_array.push(lt_MPROP[i].val);

      }
      //return 파라메터에 바인딩 추가 속성 정보 매핑.
      ls_tree.MPROP = l_array.join("|");

    }

    //callback function으로 팝업에서 선택한 라인정보 return
    oAPP.attr.oBindDialog._f_callback(true, ls_tree, oAPP.attr.oBindDialog._is_attr);

    //팝업종료 처리.
    lf_closePopup();

  }

  //unbind 버튼 선택 이벤트.
  function lf_unbindBtnEvt(){
    //callback function으로 unbind 정보 return
    oAPP.attr.oBindDialog._f_callback(false, null, oAPP.attr.oBindDialog._is_attr);

    //팝업종료 처리.
    lf_closePopup();
  }


  //입력 파라메터 설정.
  function lf_setParam(){

    //입력 카디널리티.
    oAPP.attr.oBindDialog._CARDI = CARDI;
    
    //callback function.
    oAPP.attr.oBindDialog._f_callback = f_callback;

    //팝업 title 구성.
    oAPP.attr.oBindDialog.setTitle(sTitle);

    //광역 attr 초기화.
    oAPP.attr.oBindDialog._is_attr = {};

    //입력한 attribute key 정보가 존재하는경우.
    if(typeof UIATK !== "undefined"){
      
      var l_UIATY = "";

      switch (CARDI) {
        case "F":
          l_UIATY = "1";
          break;
        
        case "T":
          l_UIATY = "3";
          break;
      
        default:
          break;
      }

      //attribute 리스트에서 해당 라인 검색.
      oAPP.attr.oBindDialog._is_attr = oAPP.attr.oModel.oData.T_ATTR.find ( a=> a.UIATK === UIATK && a.UIATY === l_UIATY );
    }

  }


  //binding 팝업 정보가 존재하는 경우.
  if(oAPP.attr.oBindDialog){
        
    //파라메터 설정.
    lf_setParam();

    //바인딩 팝업 open 처리 하위 로직 skip.
    oAPP.attr.oBindDialog.open();
    return;

  }

  sap.ui.getCore().loadLibrary("sap.ui.table");
  sap.ui.getCore().loadLibrary("sap.ui.layout");

  //바인딩 tree toolabar 정보.
  var oTool = new sap.m.Toolbar();


  //전체펼침
  var oToolBtn1 = new sap.m.Button({text:"Expand All",icon:"sap-icon://expand-all",type:"Emphasized",busy:"{/busy}",busyIndicatorDelay:1});
  oTool.addContent(oToolBtn1);

  //tree 전체펼침 이벤트
  oToolBtn1.attachPress(function(){
    oAPP.attr.oBindDialog._oTree.expandToLevel(99999);
  });

  //전체접힘
  var oToolBtn2 = new sap.m.Button({text:"Collapse All",icon:"sap-icon://collapse-all",type:"Emphasized",busy:"{/busy}",busyIndicatorDelay:1});
  oTool.addContent(oToolBtn2);

  //tree 전체접힘 이벤트
  oToolBtn2.attachPress(function(){
    oAPP.attr.oBindDialog._oTree.collapseAll();
  });

  oTool.addContent(new sap.m.ToolbarSeparator());

  //bind
  var oToolBtn3 = new sap.m.Button({text:"Bind",icon:"sap-icon://connected",type:"Accept",enabled:"{/edit}",busy:"{/busy}",busyIndicatorDelay:1});
  oTool.addContent(oToolBtn3);

  //bind 버튼 이벤트
  oToolBtn3.attachPress(function(){

    lf_bindBtnEvt();

  });

  //unbind
  var oToolBtn4 = new sap.m.Button({text:"Unbind",icon:"sap-icon://disconnected",type:"Reject",enabled:"{/edit}",busy:"{/busy}",busyIndicatorDelay:1});
  oTool.addContent(oToolBtn4);

  //unbind 버튼 선택 이벤트
  oToolBtn4.attachPress(function(){
    //unbind 처리 function 수행.
    lf_unbindBtnEvt();

  }); //unbind 버튼 선택 이벤트


  var oSpt1 = new sap.ui.layout.Splitter();

  //바인딩 tree 정보.
  var oTree = new sap.ui.table.TreeTable({
    selectionMode: "Single",
    selectionBehavior: "RowOnly",
    visibleRowCountMode: "Auto",
    rowSelectionChange:lf_selTabRow
  }); //바인딩 tree 정보.



  //tree 더블클릭 이벤트.
  oTree.attachBrowserEvent("dblclick",function(oEvent){

    //이벤트 발생 UI 정보 얻기.
    var l_ui = oAPP.fn.getUiInstanceDOM(oEvent.target,sap.ui.getCore());

    //UI정보를 얻지 못한 경우 exit.
    if(!l_ui){return;}

    //바인딩정보 얻기.
    var l_ctxt = l_ui.getBindingContext();

    //바인딩 정보를 얻지 못한 경우 exit.
    if(!l_ctxt){return;}

    //바인딩 처리.
    lf_bindBtnEvt(l_ui.getBindingContext());

  }); //tree 더블클릭 이벤트.



  oSpt1.addContentArea(oTree);


  oTree.attachFilter(function(){
    //tee에서 필터 처리시 전체 펼침 처리.
    this.expandToLevel(99999);
  });


  var oLay1 = new sap.ui.layout.SplitterLayoutData({size:"{/width}",resizable:"{/resize}"});
  oTree.setLayoutData(oLay1);

  var oTreeCol1 = new sap.ui.table.Column({
    filterProperty:"NTEXT",
    label:new sap.m.Label({text:"Object Name",design:"Bold"}),
    template: new sap.m.Text({text:"{NTEXT}"})
  });
  oTree.addColumn(oTreeCol1);

  var oTreeCol2 = new sap.ui.table.Column({
    label:new sap.m.Label({text:"Type",design:"Bold"})
  });

  var oCol2Hbox1 = new sap.m.HBox({alignItems:"Center",renderType:"Bare"});

  var oHbox1Icon1 = new sap.ui.core.Icon({ src:"{stat_src}",color:"{stat_color}" });
  oHbox1Icon1.addStyleClass("sapUiTinyMarginEnd");

  oCol2Hbox1.addItem(oHbox1Icon1);

  var oHbox1Txt1 = new sap.m.Text({text:"{TYPE}"});
  oCol2Hbox1.addItem(oHbox1Txt1);

  oTreeCol2.setTemplate(oCol2Hbox1);


  oTree.addColumn(oTreeCol2);

  var oTreeCol3 = new sap.ui.table.Column({
    label:new sap.m.Label({text:"Description",design:"Bold"}),
    template: new sap.m.Text({text:"{DESCR}"})
  });
  oTree.addColumn(oTreeCol3);

  /*var oTreeCol4 = new sap.ui.table.Column({
    label:new sap.m.Label({text:"enable",design:"Bold"}),
    template: new sap.m.Text({text:"{enable}"})
  });
  oTree.addColumn(oTreeCol4);*/

  oTree.bindAggregation("rows",{path:"/zTREE",template:new sap.ui.table.Row(),parameters: {arrayNames: ["zTREE"]}});


  //바인딩 추가속성 정보 table.
  var oTab = new sap.ui.table.Table({
    selectionMode: "None",
    selectionBehavior: "RowOnly",
    visibleRowCountMode:"Auto",
    width:"100%",
    visible:"{/resize}",
    layoutData: new sap.ui.layout.SplitterLayoutData()
  });
  oSpt1.addContentArea(oTab);


  //추가바인딩 속성의 Property 컬럼.
  var oTabCol1 = new sap.ui.table.Column({
    label:new sap.m.Label({text:"Property",design:"Bold"}),
    template: new sap.m.Text({text:"{prop}"})
  });
  oTab.addColumn(oTabCol1);

  //추가바인딩 속성의 value 컬럼.
  var oTabCol2 = new sap.ui.table.Column({
    label:new sap.m.Label({text:"Value",design:"Bold"}),
    template: new sap.m.Text({text:"{val}"})
  });
  oTab.addColumn(oTabCol2);

  var oTabCol2HBox1 = new sap.m.HBox({justifyContent:"Center",renderType:"Bare",direction:"Column"});
  oTabCol2.setTemplate(oTabCol2HBox1);

  var oTabCol2Txt1 = new sap.m.Text({text:"{val}",visible:"{txt_vis}"});
  oTabCol2HBox1.addItem(oTabCol2Txt1);

  var oTabCol2Inp1 = new sap.m.Input({value:"{val}",visible:"{inp_vis}",
    editable:"{edit}",maxLength:"{maxlen}",valueState:"{stat}",valueStateText:"{statTxt}",enabled:"{/edit}"});
  oTabCol2HBox1.addItem(oTabCol2Inp1);

  //바인딩 추가속성 정보 input 값변경 이벤트
  oTabCol2Inp1.attachChange(function(){

    var l_ctxt = this.getBindingContext();

    var ls_line = l_ctxt.getProperty();

    //Conversion Routine에서 값을 입력한 경우 하위 로직 수행.
    if(ls_line.ITMCD !== "P06"){return;}

    //Conversion 명 대문자 변환 처리.
    ls_line.val = ls_line.val.toUpperCase();
    this.setValue(ls_line.val);

  });

  var oTabCol2Sel1 = new sap.m.Select({selectedKey:"{val}",visible:"{sel_vis}",
    editable:"{edit}",valueState:"{stat}",valueStateText:"{statTxt}",enabled:"{/edit}"});
  oTabCol2HBox1.addItem(oTabCol2Sel1);

  //바인딩 추가속성 정보 DDLB 선택 이벤트.
  oTabCol2Sel1.attachChange(function(){
    var l_ctxt = this.getBindingContext();

    var ls_line = l_ctxt.getProperty();

    //Bind type DDLB을 선택하지 않은경우 exit.
    if(ls_line.ITMCD !== "P04"){return;}

    //Reference Field name 라인 정보 얻기.
    var ls_P05 = oAPP.attr.oBindDialog._oModel.oData.T_MPROP.find( a => a.ITMCD === "P05");
    if(!ls_P05){return;}

    //Reference Field name 라인 정보 얻기.
    var ls_P06 = oAPP.attr.oBindDialog._oModel.oData.T_MPROP.find( a => a.ITMCD === "P06");
    if(!ls_P06){return;}

    //Bind type DDLB을 빈값 선택한 경우.
    if(ls_line.val === ""){

     //Reference Field name DEFAULT 선택 불가능 처리.
     ls_P05.edit = false;

     //Reference Field name 선택값 초기화.
     ls_P05.val = "";

     //Conversion Routine 선택 가능 처리.
     ls_P06.edit = true;

    }else if(ls_line.val !== ""){
      //Bind type DDLB을 선택한 경우.

      //Reference Field name DEFAULT 선택 가능 처리.
      ls_P05.edit = true;

      //Conversion Routine 선택 불가 처리.
      ls_P06.edit = false;

      //Conversion Routine 선택값 초기화.
      ls_P06.val = "";

    }

  });

  oTabCol2Sel1.bindAggregation("items",{path:"T_DDLB",
    template:new sap.ui.core.Item({key:"{KEY}",text:"{TEXT}"}),
    templateShareable:true
  });

  oTab.bindAggregation("rows",{path:"/T_MPROP",template:new sap.ui.table.Row()});

  oAPP.attr.oBindDialog = new sap.m.Dialog({
      draggable: true,
      resizable: true,
      contentHeight:"80%",
      contentWidth:"70%",
      verticalScrolling:false,
      titleAlignment: "Center",
      //stretch: true,
      icon: "sap-icon://journey-depart",
      busyIndicatorDelay:1,
      subHeader:oTool,
      buttons: [
        new sap.m.Button({
          type: "Reject",
          icon: "sap-icon://decline",
          press: lf_closePopup
        }),
      ],
      content: [oSpt1
      ],
      afterOpen:lf_openPopup

    }).addStyleClass("sapUiSizeCompact");
    //}).addStyleClass("sapUiContentPadding sapUiSizeCompact");


    //파라메터 설정.
    lf_setParam();

    oAPP.attr.oBindDialog._oTree = oTree;

    oAPP.attr.oBindDialog._oModel = new sap.ui.model.json.JSONModel();
    oAPP.attr.oBindDialog.setModel(oAPP.attr.oBindDialog._oModel);


    //서버에서 바인딩 attr 정보 얻은 이후 popup open
    oAPP.attr.oBindDialog.open();



};
