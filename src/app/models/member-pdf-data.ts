import { Payment } from 'src/app/models/payment';
import { Item } from 'src/app/models/item';

export class MemberPdfData {
    public userId: number = 0;
    public userName: string = '';
    public userRationTotal: number = 0;
    public userRationBalance: number = 0;
    public payabletList: Payment[] = [];
    public receivableList: Payment[] = [];
    public itemList: Item[] = [];
}
