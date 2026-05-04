import {Component, computed, ElementRef, EventEmitter, Input, model, Output, signal, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-group',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './group.html',
  styleUrl: './group.scss',
})
export class Group {
  activeGroupMode = model<string>('');

  @Input() groupName: string = "";
  @Input() removeGroupName: string = "";

  @Output() joinedToGroup = new EventEmitter<string>();
  @Output() removedFromGroup = new EventEmitter<string>();

  @ViewChild('groupNameInput') groupNameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('removeGroupNameInput') removeGroupNameInput!: ElementRef<HTMLInputElement>;

  public groups = signal<string[]>([]);
  public groupModes = computed(() => [...this.groups(), 'all'])

  protected async joinGroup() {
    if (this.groupName.trim() === '') {
      return;
    }

    this.joinedToGroup.emit(this.groupName);

    this.groups.update(groups => [...groups, this.groupName]);
    this.groupName = '';
    this.groupNameInput.nativeElement.blur();
    this.groupNameInput.nativeElement.focus();
  }

  protected async removeFromGroup() {
    if (this.removeGroupName.trim() === '') {
      return;
    }

    this.removedFromGroup.emit(this.removeGroupName);

    this.groups.update(groups => groups.filter(group => group !== this.removeGroupName));
    this.removeGroupName = '';
    this.removeGroupNameInput.nativeElement.blur();
    this.removeGroupNameInput.nativeElement.focus();
  }
}
