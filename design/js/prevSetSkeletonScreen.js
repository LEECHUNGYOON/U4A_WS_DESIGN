(function(){

    //Skeleton Screen 사용 팝업.
    oAPP.fn.prevSetSkeletonScreen.oppner = function(){

        var oDlg = new sap.m.Dialog({draggable:true,
            icon:"sap-icon://add-document",
            contentWidth:"30%"});

        var oModel = new sap.ui.model.json.JSONModel();
        oDlg.setModel(oModel);


        var oTool = new sap.m.Toolbar();
        oDlg.setCustomHeader(oTool);

        var oTitle = new sap.m.Title({text:"Skeleton Screen Configration"});

        oTool.addContent(oTitle);

        oTool.addContent(new sap.m.ToolbarSpacer());

        //우상단 닫기버튼.
        var oBtn0 = new sap.m.Button({icon:"sap-icon://decline", type:"Reject", tooltip: "Close"});
        oTool.addContent(oBtn0);

        //닫기 버튼 선택 이벤트.
        oBtn0.attachPress(function(){
            
        });

        var oForm = new sap.ui.layout.form.Form({
            editable:true,
            layout: new sap.ui.layout.form.ResponsiveGridLayout({labelSpanM:3})
        });
        oDlg.addContent(oForm);
        
        var oFmCont = new sap.ui.layout.form.FormContainer();
        oForm.addFormContainer(oFmCont);

        var l_txt = "Based on the current preview screen layout\n" + 
                    "Do you want to set it to Skeleton Screen ?";

        //설명.
        var oFmElem0 = new sap.ui.layout.form.FormElement({
            //label : new sap.m.Label(),
            fields : new sap.m.Text({text:l_txt})
        });
        oFmCont.addFormElement(oFmElem0);

          
        //흐리기 효과.
        var oFmElem1 = new sap.ui.layout.form.FormElement({
        label : new sap.m.Label({design:"Bold",text:"Use of glass"})
        });
        oFmCont.addFormElement(oFmElem1);
        
        //흐리기 효과 사용여부 checkbox.
        var oFmChk1 = new sap.m.CheckBox();
        oFmElem1.addField(oFmChk1);
                                    
          
        //흐리기 정도.
        var oFmElem2 = new sap.ui.layout.form.FormElement({
            label : new sap.m.Label({design:"Bold",text:"glass concentration"})
        });

        oFmCont.addFormElement(oFmElem2);

        //흐리기정도 입력필드.
        var oStep = new sap.m.StepInput({step:0.1, displayValuePrecision:1});
        oFmElem2.addField(oStep);

    
        l_txt = "Glass Concentration ?\n" + 
                "I mean transparency in the skeleton screen\n" +
                "Examples of values are 0.0 to 100.0\n" +
                "Higher values make it blurry.\n" +
                "(Only one digit is allowed for the source point)";
        

        //설명.
        var oFmElem3 = new sap.ui.layout.form.FormElement({
            //label : new sap.m.Label(),
            fields : new sap.m.Text({text:l_txt})
        });

        oFmCont.addFormElement(oFmElem3);


        //이벤트 생성 버튼.
        var oBtn1 = new sap.m.Button({type:"Accept",icon:"sap-icon://accept", tooltip: "Create"});
        oDlg.addButton(oBtn1);
        
        //팝업 종료 버튼.
        var oBtn2 = new sap.m.Button({type:"Reject",icon:"sap-icon://decline", tooltip: "Close"});
        oDlg.addButton(oBtn2);

        //팝업 호출.
        oDlg.open();


    };  //Skeleton Screen 사용 팝업.

})();