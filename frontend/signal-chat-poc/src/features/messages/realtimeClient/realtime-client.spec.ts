import { TestBed } from '@angular/core/testing';

import { RealtimeClient } from './realtime-client';

describe('RealtimeClient', () => {
  let service: RealtimeClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealtimeClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
