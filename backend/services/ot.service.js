// Simple OT operations
export class OTController {
  constructor() {
    this.operations = [];
    this.text = "";
  }

  applyOperation(clientId, operation) {
    // Transform incoming operation against pending ops
    const transformedOp = this.transformOperation(
      operation,
      this.operations.length
    );

    // Apply to document
    this.text = this.applyToText(this.text, transformedOp);
    this.operations.push(transformedOp);

    return transformedOp;
  }

  transformOperation(operation, baseRevision) {
    // Get all operations that happened since the client's last revision
    const concurrentOps = this.operations.slice(baseRevision);

    // Transform the incoming operation against each concurrent operation
    let transformedOp = operation;
    for (const concurrentOp of concurrentOps) {
      transformedOp = this.transformPair(transformedOp, concurrentOp);
    }

    return transformedOp;
  }

  transformPair(op1, op2) {
    // Insert vs Insert
    if (op1.type === "insert" && op2.type === "insert") {
      if (op1.position < op2.position) {
        return op1;
      } else if (op1.position > op2.position) {
        return { ...op1, position: op1.position + op2.text.length };
      }
      // If same position, order doesn't matter (but you might want to decide)
      return op1;
    }

    // Insert vs Delete
    if (op1.type === "insert" && op2.type === "delete") {
      if (op1.position <= op2.position) {
        return op1;
      } else {
        return { ...op1, position: op1.position - op2.length };
      }
    }

    // Delete vs Insert
    if (op1.type === "delete" && op2.type === "insert") {
      if (op1.position < op2.position) {
        return op1;
      } else {
        return { ...op1, position: op1.position + op2.text.length };
      }
    }

    // Delete vs Delete
    if (op1.type === "delete" && op2.type === "delete") {
      // More complex logic needed here
      return op1; // Simplified for now
    }

    return op1;
  }

  applyToText(text, operation) {
    if (operation.type === "insert") {
      return (
        text.slice(0, operation.position) +
        operation.text +
        text.slice(operation.position)
      );
    } else if (operation.type === "delete") {
      return (
        text.slice(0, operation.position) +
        text.slice(operation.position + operation.length)
      );
    }
    return text;
  }
}
