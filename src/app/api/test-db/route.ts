// src/app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '../../../lib/mongodb';

interface DatabaseInfo {
  name: string;
  sizeOnDisk?: number;
  empty?: boolean;
}

interface ListDatabasesResult {
  databases: DatabaseInfo[];
  totalSize: number;
  ok: number;
}

export async function GET() {
  try {
    // Log the MongoDB URI (with password hidden)
    const uri = process.env.MONGODB_URI || '';
    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log('Attempting to connect with URI:', maskedUri);

    // Test direct mongoose connection first
    try {
      const directConn = await mongoose.connect(process.env.MONGODB_URI!);
      console.log('Direct connection successful to:', directConn.connection.host);
      await mongoose.disconnect();
    } catch (directError) {
      console.error('Direct connection error:', directError);
    }

    // Now try through our connection utility
    console.log('Attempting connection through utility...');
    const conn = await connectDB();
    
    // Get list of databases with proper typing
    const admin = conn.connection.db.admin();
    const dbInfo = await admin.listDatabases() as ListDatabasesResult;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to MongoDB',
      dbHost: conn.connection.host,
      databases: dbInfo.databases.map(db => db.name),
      currentDb: conn.connection.db.databaseName
    });
  } catch (error) {
    console.error('Detailed connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to connect to MongoDB',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        envVarExists: !!process.env.MONGODB_URI,
        envVarLength: process.env.MONGODB_URI?.length || 0
      },
      { status: 500 }
    );
  }
}