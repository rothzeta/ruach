// Herdr suites start real processes and sockets; Bun's 5 s per-test default fails on loaded hosts.
import { setDefaultTimeout } from 'bun:test';
setDefaultTimeout(30000);
