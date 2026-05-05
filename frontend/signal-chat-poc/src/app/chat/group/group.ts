import {Component, computed, ElementRef, EventEmitter, Input, model, Output, signal, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BaseInput} from '../../base/base-input/base-input';

@Component({
  selector: 'app-group',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BaseInput
  ],
  templateUrl: './group.html',
  styleUrl: './group.scss',
})
export class Group {
  activeGroupMode = model<string>('');

  @Output() joinedToGroup = new EventEmitter<string>();
  @Output() removedFromGroup = new EventEmitter<string>();

  public groups = signal<string[]>([]);
  public groupModes = computed(() => [...this.groups(), 'all'])

  protected async joinGroup(groupName: string) {
    this.joinedToGroup.emit(groupName);
    this.groups.update(groups => [...groups, groupName]);
  }

  protected async removeFromGroup(groupName: string) {
    this.removedFromGroup.emit(groupName);
    this.groups.update(groups => groups.filter(group => group !== groupName));
  }
}
