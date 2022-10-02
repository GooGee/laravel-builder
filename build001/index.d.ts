interface Collection extends SideBarItem {
    id: number
    name: string
    color: string
    description: string
    valueDescription: string
    tagDescription: string
    reserved: boolean
}

interface CollectionItem {
    id: number
    collectionId: number
    name: string
    value: string
    tag: string
}

interface Column {
    id: number
    schemaId: number
    name: string
    type: string
    length: number
    default: string
    scale: number
    unsigned: boolean
    unique: boolean
    nullable: boolean
    comment: string
    fillable: boolean
    ro: boolean
    wo: boolean
    cast: string
    fakeRaw: boolean
    fakeUnique: boolean
    fakeMethod: string
    fakeText: string
    constraintzz: ColumnConstraint[]
    inTable: boolean
    tf: TypeFormat
}

interface Directory {
    id: number
    opened: boolean
    parentId: number | null
    name: string
    folderNamePattern: string
    nameSpacePattern: string
}

interface File {
    id: number
    parentId: number
    name: string
    color: string
    layer: string
    classNamePattern: string
    fileNamePattern: string
    folderNamePattern: string
    nameSpacePattern: string
}

interface Index {
    id: number
    type: string
    schemaId: number
}

interface IndexColumn {
    id: number
    columnId: number
    indexId: number
    sort: number
}

interface Path extends SideBarItem {
    id: number
    schemaId: number
    name: string
    color: string
    description: string
    summary: string
    parameterzz: number[]
}

interface Relation {
    id: number
    type: string
    name0: string
    name1: string
    schema0Id: number
    schema1Id: number
    column1Id: number
}

interface Schema extends SideBarItem {
    id: number
    opened: boolean
    openedColumn: boolean
    name: string
    description: string
    color: string
    x: number
    y: number
}

interface Wu extends SideBarItem {
    id: number
    schemaId: number
    name: string
    type: string
    isRequest: boolean
    color: string
    description: string
}

interface WuChild {
    id: number
    wuId: number
    reference: Reference
}

interface WuColumn {
    id: number
    wuId: number
    columnId: number
    alias: string
}

interface WuParameter {
    id: number
    wuId: number
    name: string
    description: string
}

interface AbstractSchema {
    id: number
}

interface ApiErrorResponse {
    detail?: string
    message: string
    errorzz: Record<string, string[]>
}

interface ApiResponse<T> {
    status: number
    message: string
    data: T
}

interface ColumnConstraint {
    name: string
    parameter: string
}

interface DBData {
    name: string
    tables: DBTable
    version: number
}

interface DBCountResult {
    amount: number
}

interface DBTable {
    Collection: Collection[]
    CollectionItem: CollectionItem[]
    Column: Column[]
    Directory: Directory[]
    File: File[]
    Index: Index[]
    IndexColumn: IndexColumn[]
    ModuleAction: ModuleAction[]
    ModuleActionFile: ModuleActionFile[]
    Relation: Relation[]
    Path: Path[]
    Schema: Schema[]
    Wu: Wu[]
    WuChild: WuChild[]
    WuColumn: WuColumn[]
    WuParameter: WuParameter[]
}

interface DataForScript {
    action: string
    db: DBData
    dependencyzz: string[]
    file: File
    fileMap: Record<string, string>
    helper: any
    lodash: lodash
    ma?: ModuleAction
    schema: Schema
    tree: DataForScriptTreeHelper
    treeMap: Map<number, LinkedTreeNode<Directory>>
}

interface DataForScriptTreeHelper {
    getClassName: (file: File, schema: Schema, action: string) => string
    getFullClassName: (file: File, schema: Schema, action: string) => string
    getFullDirectoryName: (
        directory: Directory,
        schema: Schema,
        action: string,
    ) => string
    getFullFileName: (file: File, schema: Schema, action: string) => string
    getFullNameSpace: (directory: Directory, schema: Schema, action: string) => string
    getFullNameSpaceOfFile: (file: File, schema: Schema, action: string) => string
    getNamezz: (directory: Directory, namezz: string[], nameSpace?: boolean) => string[]
}

interface DiskFile {
    name: string
    content: string
}

interface IndexColumnDetail extends IndexColumn {
    name: string
}

interface IndexDetail extends Index {
    columnzz: IndexColumnDetail[]
}

interface Info {
    version: string
    packageName: string
    data: string | null
}

interface InfoData {
    db: DBData
    setting: Setting
}

interface LinkedTreeNode<T> {
    childzz: LinkedTreeNode<T>[]
    parent?: LinkedTreeNode<T>
}

interface Migration {
    batch: number
    version: string
}

interface MigrationStatus {
    dbexist: boolean
    filezz: DiskFile[]
    migrationzz: Migration[]
}

interface ModuleAction {
    id: number
    directoryId: number
    testDirectoryId: number
    schemaId: number
    moduleId: number
    collectionItemId: number
    deprecated: boolean
    description: string
    summary: string
    request: OperationRequest
    responsezz: OperationResponse[]
    pathId: number
    method: string
}

interface ModuleActionFile {
    id: number
    moduleActionId: number
    fileId: number
    directoryId: number
}

interface OperationRequest {
    required: boolean
    description: string
    reference: Reference
}

interface OperationResponse {
    status: string
    description: string
    reference: Reference
}

interface Reference {
    kind: string
    targetId: number
    argumentzz: Reference[]
}

interface Setting {}

interface SideBarItem extends WithId {
    name: string
    color: string
    description: string
    reserved: boolean
}

declare enum Type {
    boolean = "boolean",
    integer = "integer",
    number = "number",
    string = "string",
}

interface TypeFormat {
    isArray: boolean
    type: Type
    format: string
}

interface WithId {
    id: number
}
