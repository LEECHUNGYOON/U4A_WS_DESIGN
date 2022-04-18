(function(){
  //가운데 페이지(미리보기 영역) 구성
  oAPP.fn.uiPreviewArea = function(oMPage){

    //미리보기 영역 구성.
    var oMfrm1 = new sap.ui.core.HTML({content:"<div style='width:100%; height:100%; overflow:hidden;'>" +
      "<iframe id='prevHTML' style='width:100%; height:100%;' frameborder=0 " +
      "framespacing=0 marginheight=0 marginwidth=0 ></iframe></div>"});
    oMPage.addContent(oMfrm1);


  };  //가운데 페이지(미리보기 영역) 구성


  

  //미리보기 화면 UI의 프로퍼티 변경 처리.
  oAPP.fn.previewUIsetProp = function(is_attr){
    
    //프로퍼티가 아닌경우 exit. 
    if(is_attr.UIATY !== "1"){return;}

    //최상위인 경우 exit.
    if(is_attr.OBJID === "ROOT"){return;}

    //styleClass 프로퍼티에 값을 입력한 경우.
    if(is_attr.UIATK.substr(0,3) === "EXT" && is_attr.UIASN === "STYLECLASS"){
      //미리보기 화면의 UI STYLECLASS 처리.
      oAPP.fn.previewUIaddStyleClass(is_attr);
      return;
    }

    //dragAble, dropAble 프로퍼티의 경우 처리할건이 존재하지 않기에 exit 처리.
    if(is_attr.UIASN === "DRAGABLE" || is_attr.UIASN === "DROPABLE"){
      return;
    }

    //default property
    var l_uiaty = "1";

    //직접 입력가능한 aggregation인경우 UIATY을 aggregation으로 변경.
    if(is_attr.UIATK.indexOf("_1") !== -1){
      l_uiaty = "3";
    }

    //setProperty 명 얻기.
    var l_propnm = oAPP.fn.getUIAttrFuncName(oAPP.attr.prev[is_attr.OBJID], l_uiaty, is_attr.UIATT, "_sMutator");

    //바인딩 처리된 경우.
    if(is_attr.ISBND === "X"){
      //대상 프로퍼티 초기화 처리.
      oAPP.attr.prev[is_attr.OBJID][l_propnm]();
      return;
    }

    var l_prop = is_attr.UIATV;

    //프로퍼티 타입에 따른 입력값 parse 처리.
    switch(is_attr.UIADT){

       case "boolean":
         l_prop = false;
         if(is_attr.UIATV === "true"){
           l_prop = true;
         }
         break;

       case "int":
         l_prop = parseInt(is_attr.UIATV) || 0;
         break;

       case "float":
         l_prop = parseFloat(is_attr.UIATV) || 0;
         break;

       default:
         break;
    }


    //예외처리 대상 프로퍼티입력건 여부 확인.
    var l_ua032 = oAPP.DATA.LIB.T_9011.find( a => a.CATCD === "UA032" && a.FLD01 === is_attr.UIOBK && a.FLD03 === is_attr.UIATT && a.FLD06 !== "X" );
    
    //예외처리 대상 프로퍼티를 입력한 경우.
    if(l_ua032 && l_ua032.FLD07 !== ""){
      //해당 function을 수행한 결과값으로 변경 처리.
      l_prop = oAPP.attr.ui.frame.contentWindow[l_ua032.FLD07](l_prop);
      
    }

    //UI.setProperty(value); 처리.
    try{
      oAPP.attr.prev[is_attr.OBJID][l_propnm](l_prop);
    }catch(e){
      
    }

  };  //미리보기 화면 UI의 프로퍼티 변경 처리.




  //미리보기 UI styleClass 프로퍼티 처리.
  oAPP.fn.previewUIaddStyleClass = function(is_attr){

    var l_ui = oAPP.attr.prev[is_attr.OBJID];

    //이전에 적용한 style class 제거 처리.
    if(l_ui.aCustomStyleClasses){
      l_ui.removeStyleClass(l_ui.aCustomStyleClasses.join(" "));
    }

    l_ui.addStyleClass(is_attr.UIATV);

  };  //미리보기 UI styleClass 프로퍼티 처리.




  //대상 UI instnace의 UIOBJ명 얻기.
  oAPP.fn.getUIOBJname = function(oUI){

    for(var i in oAPP.attr.prev){

      if(oAPP.attr.prev[i] === oUI){
        return i;
      }

    }

  };  //대상 UI instnace의 UIOBJ명 얻기.




  //프로퍼티에 값 구성시 따옴표 처리 여부.
  oAPP.fn.setPropDoqu = function(UIADT){

    //프로퍼티 타입에 따른 따옴표 적용여부.
    switch(UIADT){

      case "boolean":
      case "int":
      case "float":
        //따옴표 적용 불필요.
        return "";
        break;

      default:
        //그외건인경우 따옴표 적용.
        return '"';
        break;

    }

  };  //프로퍼티에 값 구성시 따옴표 처리 여부.




  //sap.ui.core.HTML UI의 content 프로퍼티 입력건 검색.
  oAPP.fn.setHTMLContentProp = function(is_0015){
    
    //sap.ui.core.HTML UI의 content 프로퍼티가 아닌경우 exit.
    if(is_0015.UIATK !== "AT000011858"){return;}

    //HTML, script 구성건이 존재하지 않는경우 exit.
    if(oAPP.DATA.APPDATA.T_CEVT.length === 0){return;}

    //sap.ui.core.HTML UI의 content 프로퍼티 입력건에 해당하는 정보 검색.
    var l_find = oAPP.DATA.APPDATA.T_CEVT.find( a=> a.OBJTY === "HM" && a.OBJID === is_0015.OBJID + is_0015.UIASN);

    //찾지못한경우 exit.
    if(typeof l_find === "undefined"){return;}
    debugger;
    //HTML content에 입력한 정보가 존재하는경우 return.
    l_find = JSON.stringify(l_find.DATA);

    return l_find.substr(1,l_find.length-2);

  };  //sap.ui.core.HTML UI의 content 프로퍼티 입력건 검색.


})();
