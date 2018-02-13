import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessageService {
    subject = new Subject<any>();

    
    public sendMessage(message: string) {
        this.subject.next({ text: message });
    }

    public clearMessage() {
        this.subject.next();
    }

    public getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
