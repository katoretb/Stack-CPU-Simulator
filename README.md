# Stack-CPU-Simulator

A **Stack CPU** is a fascinating piece of hardware that operates on a unique principle. It primarily comprises of three essential components:

- **Memory (MEM)** - This is where the instructions for operations are stored.

- **Data Stack (DS)** - A stack-based data structure used for storing intermediate results.

- **Return Stack (RS)** - Another stack-based structure utilized for storing return addresses.

The stack CPU operates based on the instructions stored in the **Memory**, starting from the instruction pointed to by the **Program Counter (PC)**. A single instruction is made up of two parts:

- **The opcode** - This indicates the type of instruction. The subsequent memory location will serve as the operand, which may or may not be present.

- **The operand** - Depending on the instruction, the operation may require zero to two operands.

Once an instruction execution is complete, the **PC** advances to point to the next instruction, and the process continues by executing that instruction. This cycle repeats continuously, making the CPU work.