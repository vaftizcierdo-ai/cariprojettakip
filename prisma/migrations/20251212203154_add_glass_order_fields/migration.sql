-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GlassOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "supplier" TEXT NOT NULL,
    "orderDate" DATETIME NOT NULL,
    "deliveryDate" DATETIME,
    "items" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Ordered',
    "supplierOrderCode" TEXT,
    "supplierDeliveryDate" DATETIME,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GlassOrder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GlassOrder" ("createdAt", "deliveryDate", "description", "id", "items", "orderDate", "projectId", "status", "supplier", "updatedAt") SELECT "createdAt", "deliveryDate", "description", "id", "items", "orderDate", "projectId", "status", "supplier", "updatedAt" FROM "GlassOrder";
DROP TABLE "GlassOrder";
ALTER TABLE "new_GlassOrder" RENAME TO "GlassOrder";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
