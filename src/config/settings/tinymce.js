export default {
    edidor_settings: {
        apikey:'oq5iukdtuvton4zy3smr1m1pwaar2rfkjg98z8p1fv5q8tbt',
        init: {
            height : 300,
            selector: "textarea",
            menubar: false,
            table_toolbar: [
                'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol'
            ],
            plugins: [
                'print preview fullpage importcss searchreplace autolink \
                autosave save directionality visualblocks visualchars fullscreen image link media template codesample \
                table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount \
                imagetools textpattern noneditable help charmap quickbars  emoticons'
            ],
            toolbar:[
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help table'
            ],
        },
        initialValue: '<p>This is the initial content of the editor</p>',
    }
}