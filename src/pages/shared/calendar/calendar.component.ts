import { Component, OnInit, group } from '@angular/core';
import { AppointmentService } from '../../../services/AppointmentService/appointment.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ColorModel } from '../../../models/ColorModel';
import { Base } from '../../base/Base';
import { Observable } from 'rxjs/Observable';
import { DAYS_OF_WEEK, CalendarEvent } from 'calendar-utils';
import { CalendarEventAction, CalendarDateFormatter, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { CustomDateFormatter } from '../../../providers/custom-date-formatter.provider';
import { CalendarService } from '../../../services/CalendarService/calendar.service';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import * as moment from 'moment';
import { IMyDpOptions } from 'mydatepicker';
import { AppointmentTypeModel } from '../../../models/AppointmentTypeModel';
import { Calendar } from 'fullcalendar';

declare const $: any;
declare interface DataTable {
  headerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [  
    AppointmentService,
    CalendarService,
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class CalendarComponent implements OnInit {
  dtOptions: any;
  boxColor: string;
  doctortc: string;
  selectedDay: string;
  _selectedDay: string;
  
  selectedAppointment: any = {};
  selectedAppointmentType: string;
  selectedAppointmentTypeId: string;

  eventDtTrigger: Subject<DataTable> = new Subject();  
  eventArray: Array<object> = [];
  selectedEventType = {};

  appointmentTypeArray: any = [];

  colorArray: Array<ColorModel> = [];
  selectedColor: any = {};

  eventStartDate: any;
  eventFinishDate: any;
  date: Date = new Date();

  //Calendar
  view: string = 'month';
  locale: string = 'tr';
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  appointments: CalendarEvent[] = [];
  selectedEvents: CalendarEvent[];
  activeDayIsOpen: boolean = false;
  refresh: Subject<any> = new Subject();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edit', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Delete', event);
      }
    }
  ];

  //Credentials
  appointmentTypeCredentials = {
    randevutipiid: '',
    doktortc: '',
    isim: '',
    renk: '',
    sure: ''
  };

  eventCredentials = {
    randevuid: '',
    doktortc: '',
    kayityapantc: '',
    baslangictarih: '',
    bitistarih: '',
    randevutipi: '',
    aciklama: '',
    randevutipiadi: ''
  };

	calendarSettings = {
		bigBanner: true,
		timePicker: true,
		format: 'dd/MM/yyyy hh:mm',
    defaultOpen: false,
    closeOnSelect: true
  }
  
  //Observable Objects
  event: {};
  appointmentType: {};


  constructor(private appointmentService: AppointmentService,
    private calendarService: CalendarService,
    private toastr: ToastrService,
    private router: Router) {
  }


  ngOnInit() {
    let role = sessionStorage.getItem('currentRole');
    if(role != 'doktor' && role != 'sekreter') {
      this.router.navigate(['main/error']);
      return;
    }
    
    let currentRole = sessionStorage.getItem('currentRole');
    if (currentRole == 'doktor') {
      this.doctortc = sessionStorage.getItem('tc');
    } else if (currentRole == 'sekreter') {
      this.doctortc = sessionStorage.getItem('currentDoctorTc');
    }

    this.configure();
    this.getAppointmentTypes();
    this.getCalendarEvents();
  }

  public configure(): void {
    this.boxColor = sessionStorage.getItem('boxColor');

    var today = moment(new Date);
    today.locale('tr');
    this.selectedDay = moment(today).format('LL');
    this.getSelectedDayEvents(moment(today).format('L'));

    this.dtOptions = Base.dataTableOptions;
  }


  //Appointment Type funcs.
  public getAppointmentTypes(): void {
    this.appointmentService.getAppointmentTypes(this.doctortc).subscribe(data => {
      if(data.returncode == 0) {
        this.appointmentTypeArray = data.randevutipi;
        this.appointments = [];
        for(let item of data.randevutipi) {
          var appointment: CalendarEvent = {
            start: new Date(),
            end: new Date(),
            title: item.isim,
            color: {
              primary: '#' + item.hexcode,
              secondary: '#D1E8FF'
            },
            actions: this.actions,
            draggable: true,
            eventId: item.randevutipiid,
            isEvent: false,
            class: "external-event " + item.renkadi,
            style: ''
          };
          
          this.appointments.push(appointment);
        }
      } 
    });
  }

  public getAppointmentTypebyId(id): void {
    for(let type of this.appointmentTypeArray) {
      if(type.randevutipiid == id) {
        this.selectedAppointmentType = type.name;
      }
    }
  }

  public getAppointmentTypebyName(name): any {
    for(let type of this.appointmentTypeArray) {
      if(type.isim == name) {
        return type.randevutipiid;
      }
    }
  }

  public eventDropped({event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    if(!event.isEvent) {
      var end: any;
      this.appointmentService.getAppointmentType(event.eventId).subscribe(data => {
        if(data.returncode == 0) {
          end = moment(newStart).add(data.randevutipi[0].sure, 'm').toDate();
          let credentials = {
            randevuid: '',
            doktortc: this.doctortc,
            kayityapantc: this.doctortc,
            baslangictarih: moment(newStart).format('YYYY-MM-DD hh:mm'),
            bitistarih: moment(end).format('YYYY-MM-DD hh:mm'),
            randevutipi: event.eventId,
            aciklama: event.title
          };

          this.calendarService.addEvent(credentials).subscribe(data => {
            if(data.returncode == 0) {
              this.getCalendarEvents();
              this.getCalendarEventDetail(data.randevu[0].randevuid);
              this.toastr.success('', data.message);
            } else {
              this.toastr.warning('', data.message);
            }
          });
        }
      });
    }
  }


  //Calendar funcs.
  public handleEvent(action: string, event: CalendarEvent) {
    if(action == 'Clicked') {
      this.getCalendarEventDetail(event.eventId);
    } else if(action == 'Edit') {
      this.getCalendarEventDetail(event.eventId);
    } else if(action = 'Delete') {
      this.deleteCalendarEvent();
    }
  }
  
  public eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    if(event.isEvent) {
      this.calendarService.updateEventDate(event.eventId, moment(newStart).format('YYYY-MM-DD hh:mm'), moment(newEnd).format('YYYY-MM-DD hh:mm')).subscribe(data => {
        if(data.returncode == 0) {
          this.toastr.success('', data.message);
        } else {
          this.toastr.warning('', data.message);
        }
      })
  
      event.start = newStart;
      event.end = newEnd;
      this.refresh.next();
    } 
  }

  public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }) {
    var currentDate = moment(date);
    currentDate.locale('tr');
    this.selectedDay = moment(currentDate).format('LL');
    this._selectedDay = moment(currentDate).format('L')
    this.getSelectedDayEvents(this._selectedDay);

    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  public getSelectedDayEvents(date): void {
    let splitDate = date.split('.', 3);
    date = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
    this.calendarService.getDayEvents(this.doctortc, date).subscribe(data => {
      if(data.returncode == 0) {
        this.eventArray = data.randevu;
      } else if(data.returncode == 4) {
        this.eventArray = [];
      }
    });
  }

  public getCalendarEvents(): void {
    this.calendarService.getEvents(this.doctortc).subscribe(data => {
      if(data.returncode == 0) {
        this.events = [];
        for(var item of data.randevu) {
          var event: CalendarEvent = {
            start: new Date(item.baslangictarih),
            end: new Date(item.bitistarih),
            title: item.aciklama,
            color: {
              primary: '#' + item.hexcode,
              secondary: '#D1E8FF'
            },
            actions: this.actions,
            draggable: true,
            eventId: item.randevuid,
            isEvent: true,
            class: "",
            resizable: {
              beforeStart: true,
              afterEnd: true
            },
            meta: {
              type: item.randevutipi
            },
            style: item.hexcode
          };

          this.events.push(event);
        }
      }
    });
  }

  public getCalendarEventDetail(id): void {
    this.eventCredentials.randevuid = id;
    this.calendarService.getEvent(id).subscribe(data => {
      if(data.returncode == 0) {
        this.event = Observable.of({
          aciklama: data.randevu[0].aciklama
        }).delay(100);

        this.eventStartDate = moment(data.randevu[0].baslangictarih).format();
        this.eventFinishDate = moment(data.randevu[0].bitistarih).format();
        this.selectedAppointment = data.randevu[0].isim;

        this.eventCredentials.randevutipiadi = data.randevu[0].randevutipiadi;
        this.eventCredentials.randevuid = data.randevu[0].randevuid;
        this.eventCredentials.aciklama = data.randevu[0].aciklama;
        this.eventCredentials.doktortc = data.randevu[0].doktortc;
        this.eventCredentials.kayityapantc = this.doctortc;
        this.eventCredentials.randevutipi = data.randevu[0].randevutipi;

        this.openModal('updateCalendarEventModal');
      }
    });
  }

  public addCalendarEvent(): void {
    this.eventCredentials.doktortc = this.doctortc;
    this.eventCredentials.kayityapantc = this.doctortc;
    this.eventCredentials.randevutipi = this.selectedAppointmentType["randevutipiid"];
    this.eventCredentials.baslangictarih = moment(this.eventStartDate).format('YYYY-MM-DD hh:mm');
    this.eventCredentials.bitistarih = moment(this.eventFinishDate).format('YYYY-MM-DD hh:mm');

    this.calendarService.addEvent(this.eventCredentials).subscribe(data => {
      if(data.returncode == 0) {
        this.getCalendarEvents();
        this.getSelectedDayEvents(this._selectedDay);
        this.disposeEventCredentials();
        this.closeModal('addCalendarEventModal');
        this.toastr.success('', data.message);
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }

  public updateCalendarEvent(): void {
    this.eventCredentials.baslangictarih = moment(this.eventStartDate).format('YYYY-MM-DD hh:mm');
    this.eventCredentials.bitistarih = moment(this.eventFinishDate).format('YYYY-MM-DD hh:mm');

    this.calendarService.updateEvent(this.eventCredentials).subscribe(data => {
      if(data.returncode == 0) {
        this.getCalendarEvents();
        this.closeModal('updateCalendarEventModal');
        this.disposeEventCredentials();
        this.toastr.success('', data.message);
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }

  public deleteCalendarEvent(): void {
    this.calendarService.deleteEvent(this.eventCredentials.randevuid).subscribe(data => {
      if(data.returncode == 0) {
        this.getCalendarEvents();
        this.getSelectedDayEvents(this._selectedDay);
        this.closeModal('updateCalendarEventModal');
        this.toastr.success('', data.message);
      } else if(data.returncode == 4) {
        this.toastr.warning('', data.message);
      }
    });
  }


  //Navigations
  public openModal(param): void {
    var modalname = '#' + param;
    $(modalname).modal('show'); 
  }

  public closeModal(param): void {
    var modalname = '#' + param;
    $(modalname).modal('hide'); 
  }

  public disposeEventCredentials(): void {
    this.eventCredentials = {
      randevuid: '',
      doktortc: '',
      kayityapantc: '',
      baslangictarih: '',
      bitistarih: '',
      randevutipi: '',
      aciklama: '',
      randevutipiadi: ''
    };
  }


  //Customs
  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(cell => {
      const groups: any = {};
      cell.events.forEach((event: CalendarEvent<{ type: string }>) => {
        groups[event.meta.type] = groups[event.meta.type] || [];
        groups[event.meta.type].push(event);
      });
      
      cell['eventGroups'] = Object.entries(groups);
    });
  }

  setStyles(color) {
    let styles = {
      'background-color': '#' + color
    };
    return styles;
  }

}
