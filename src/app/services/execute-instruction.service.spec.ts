import { TestBed } from '@angular/core/testing';

import { ExecuteInstructionService } from './execute-instruction.service';

describe('ExecuteInstructionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExecuteInstructionService = TestBed.get(ExecuteInstructionService);
    expect(service).toBeTruthy();
  });
});
