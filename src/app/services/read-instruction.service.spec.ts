import { TestBed } from '@angular/core/testing';

import { ReadInstructionService } from './read-instruction.service';

describe('ReadInstructionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReadInstructionService = TestBed.get(ReadInstructionService);
    expect(service).toBeTruthy();
  });
});
