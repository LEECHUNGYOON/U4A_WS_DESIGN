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
    if(is_attr.UIATY !== "1"){return;}
    if(is_attr.OBJID === "ROOT"){return;}

    //styleClass 프로퍼티에 값을 입력한 경우.
    if(is_attr.UIATK.substr(0,3) === "EXT" && is_attr.UIASN === "STYLECLASS"){
      //미리보기 화면의 UI STYLECLASS 처리.
      oAPP.fn.previewUIaddStyleClass(is_attr);
      return;
    }

    //external property의 경우 exit.
    if(is_attr.UIATK.substr(0,3) === "EXT"){return;}

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
         l_prop = parseInt(is_attr.UIATV);
         break;

       case "float":
         l_prop = parseFloat(is_attr.UIATV);
         break;

       default:
         break;
    }


    oAPP.attr.prev[is_attr.OBJID][l_propnm](l_prop);

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

})();
