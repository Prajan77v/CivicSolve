import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DEFAULT_APPEARANCE_SETTINGS, AppearanceSettingsData } from '@/types/appearance'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(DEFAULT_APPEARANCE_SETTINGS)
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { appearanceSettings: true },
    })

    if (!user || !user.appearanceSettings) {
      return NextResponse.json(DEFAULT_APPEARANCE_SETTINGS)
    }

    const settings: AppearanceSettingsData = {
      theme: (user.appearanceSettings.theme as any) || DEFAULT_APPEARANCE_SETTINGS.theme,
      accentKey: (user.appearanceSettings.accentKey as any) || DEFAULT_APPEARANCE_SETTINGS.accentKey,
      customColor: user.appearanceSettings.customColor || null,
      density: (user.appearanceSettings.density as any) || DEFAULT_APPEARANCE_SETTINGS.density,
      motion: (user.appearanceSettings.motion as any) || DEFAULT_APPEARANCE_SETTINGS.motion,
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching appearance settings:', error)
    return NextResponse.json(DEFAULT_APPEARANCE_SETTINGS)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()

    const theme = ['light', 'dark', 'system'].includes(body.theme) ? body.theme : 'system'
    const accentKey = ['ocean-blue', 'civic-green', 'indigo', 'amber', 'rose', 'slate', 'custom'].includes(body.accentKey) ? body.accentKey : 'ocean-blue'
    const customColor = typeof body.customColor === 'string' && body.customColor.startsWith('#') ? body.customColor : null
    const density = ['compact', 'comfortable', 'spacious'].includes(body.density) ? body.density : 'comfortable'
    const motion = ['full', 'reduced', 'off'].includes(body.motion) ? body.motion : 'full'

    if (!session?.user?.email) {
      return NextResponse.json({
        success: true,
        persisted: 'client-only',
        settings: { theme, accentKey, customColor, density, motion },
      })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({
        success: true,
        persisted: 'client-only',
        settings: { theme, accentKey, customColor, density, motion },
      })
    }

    const updated = await prisma.appearanceSettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        theme,
        accentKey,
        customColor,
        density,
        motion,
      },
      update: {
        theme,
        accentKey,
        customColor,
        density,
        motion,
      },
    })

    // Log to AuditLog
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'APPEARANCE_UPDATE',
        entity: 'UserAppearance',
        entityId: updated.id,
        details: JSON.stringify({ theme, accentKey, density, motion }),
      },
    }).catch(() => null)

    return NextResponse.json({
      success: true,
      persisted: 'database',
      settings: {
        theme: updated.theme,
        accentKey: updated.accentKey,
        customColor: updated.customColor,
        density: updated.density,
        motion: updated.motion,
      },
    })
  } catch (error) {
    console.error('Error updating appearance settings:', error)
    return NextResponse.json({ error: 'Failed to update appearance settings' }, { status: 500 })
  }
}
