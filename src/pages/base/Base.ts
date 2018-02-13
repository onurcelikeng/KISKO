
export class Base {
    public static boxColor = sessionStorage.getItem('boxColor');
    public static currentDoctorTC = sessionStorage.getItem('tc');

    public static dataTableOptions = {
        bLengthChange:false,
        searching:false,
        header:false,
        info:false,
        infoEmpty:false,
        pageLength:25,
        sort:false,
        paginate:false
      };

}