import { NextFunction, Request, Response } from 'express'
import { ElectronicBillCreditNotePresenterUseCase } from '../../../../../application/useCases/ElectronicBillCreditNotePresenter'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const presentElectronicBillCreditNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser, number } = req.params

  const billNumber = number ? Number(`${number}`) : 0

  const electronicBillCreditNotePresenterUseCase = new ElectronicBillCreditNotePresenterUseCase()

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true

    // Por ahora reutilizamos el permiso de creación de factura electrónica,
    // dado que la presentación de una nota crédito es una operación con impacto fiscal.
    const havePermission = validatePermission(
      permissionsList.electronic_bill.present_credit_note,
      session.data.user.permissions,
      doesSuperAdminHavePermission
    )

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await electronicBillCreditNotePresenterUseCase.run(
      session.data.user.entityId,
      billNumber
    )

    res.json({ message: 'Nota crédito presentada correctamente', data: response })
    return
  } catch (e) {
    return next(e)
  }
}

