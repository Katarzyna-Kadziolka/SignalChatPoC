import {Component, computed, ElementRef, EventEmitter, Input, model, Output, signal, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BaseInput} from '../../base/base-input/base-input';
import {AddToGroupMessage} from '../../../domain/entities/add-to-group-message';
import {RemoveFromGroupMessage} from '../../../domain/entities/remove-from-group-message';

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

  @Output() joinedToGroup = new EventEmitter<AddToGroupMessage>();
  @Output() removedFromGroup = new EventEmitter<RemoveFromGroupMessage>();

  public groups = signal<string[]>([]);
  public groupModes = computed(() => [...this.groups(), 'all'])

  protected async addToGroup(groupName: string) {
    let message: AddToGroupMessage = {
      groupName,
    }

    this.joinedToGroup.emit(message);
    this.groups.update(groups => [...groups, groupName]);
  }

  protected async removeFromGroup(groupName: string) {
    let message: RemoveFromGroupMessage = {
      groupName,
    }

    this.removedFromGroup.emit(message);
    this.groups.update(groups => groups.filter(group => group !== groupName));
  }
}
